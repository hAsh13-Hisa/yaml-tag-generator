const https = require('https');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST' && event.path.includes('/api/scrape')) {
    try {
      const { url: noteUrl } = JSON.parse(event.body);
      
      if (!noteUrl || !noteUrl.includes('note.com')) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid URL' })
        };
      }
      
      const data = await scrapeNoteArticle(noteUrl);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to scrape page' })
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  };
};

function scrapeNoteArticle(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let html = '';
      response.on('data', chunk => {
        html += chunk.toString();
      });
      
      response.on('end', () => {
        const data = extractArticleData(html);
        resolve(data);
      });
    }).on('error', reject);
  });
}

function extractArticleData(html) {
  const data = {
    title: '',
    author: '',
    publish_date: '',
    tags: [],
    summary: ''
  };
  
  // タイトル - 複数のパターンを試す
  const titlePatterns = [
    /<meta[^>]*data-hid="og:title"[^>]*content="([^"]+)"/,
    /<meta property="og:title" content="([^"]+)"/,
    /<title>([^<]+)<\/title>/
  ];
  
  let titleMatch = null;
  for (const pattern of titlePatterns) {
    titleMatch = html.match(pattern);
    if (titleMatch) break;
  }
  
  if (titleMatch) {
    const fullTitle = titleMatch[1];
    const parts = fullTitle.split('｜');
    data.title = parts[0].trim();
    if (parts.length > 1) {
      data.author = parts[parts.length - 1].trim();
    }
  }
  
  // 公開日 - 記事内から抽出
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (articleMatch) {
    const articleContent = articleMatch[1];
    const dateMatch = articleContent.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
    if (dateMatch) {
      data.publish_date = dateMatch[1];
    }
    
    // 記事にYAMLフロントマターが既に含まれているかチェック
    const firstPart = articleContent.substring(0, 2000);
    const hasYamlFrontmatter = firstPart.includes('---') && 
                              firstPart.match(/^[\s]*---[\s\S]*?(title:|tags:|author:)[\s\S]*?---/m);
    
    // YAMLフロントマターがない場合のみハッシュタグを抽出
    if (!hasYamlFrontmatter) {
      const hashtagMatches = articleContent.matchAll(/#([^\s\u3000<]+)/g);
      const tagSet = new Set();
      for (const match of hashtagMatches) {
        const tag = match[1].trim();
        if (tag && tag.length > 0 && tag.length < 50) {
          tagSet.add(tag);
        }
      }
      data.tags = Array.from(tagSet);
    }
  }
  
  // 概要を記事本文から直接抽出
  if (!data.summary && articleMatch) {
    const articleContent = articleMatch[1];
    
    // 記事の最初の段落を探す（YAMLブロック以外）
    const paragraphs = articleContent.match(/<p[^>]*>([^<]+)<\/p>/g);
    if (paragraphs && paragraphs.length > 0) {
      for (const para of paragraphs) {
        const textMatch = para.match(/<p[^>]*>([^<]+)<\/p>/);
        if (textMatch && textMatch[1].length > 20 && 
            !textMatch[1].includes('title:') && 
            !textMatch[1].includes('author:') &&
            !textMatch[1].includes('tags:')) {
          data.summary = textMatch[1].trim();
          break;
        }
      }
    }
    
    // 段落が見つからない場合、divの中のテキストを探す
    if (!data.summary) {
      const divTexts = articleContent.match(/<div[^>]*>([^<]{30,})<\/div>/g);
      if (divTexts && divTexts.length > 0) {
        for (const divText of divTexts) {
          const textMatch = divText.match(/<div[^>]*>([^<]+)<\/div>/);
          if (textMatch && textMatch[1].length > 30 && 
              !textMatch[1].includes('title:') && 
              !textMatch[1].includes('author:')) {
            data.summary = textMatch[1].trim();
            break;
          }
        }
      }
    }
  }
  
  // 上記で見つからない場合、og:descriptionから取得
  if (!data.summary) {
    const descPatterns = [
      /<meta[^>]*data-hid="og:description"[^>]*content="([^"]+)"/,
      /<meta property="og:description" content="([^"]+)"/,
      /<meta name="description" content="([^"]+)"/
    ];
    
    for (const pattern of descPatterns) {
      const match = html.match(pattern);
      if (match) {
        // HTMLエンティティをデコード
        let summary = match[1];
        summary = summary.replace(/&quot;/g, '"');
        summary = summary.replace(/&amp;/g, '&');
        summary = summary.replace(/&lt;/g, '<');
        summary = summary.replace(/&gt;/g, '>');
        
        // YAMLが含まれている場合はYAMLブロック後の内容を使用
        if (summary.includes('title:') && summary.includes('author:')) {
          const yamlEndIndex = summary.indexOf('...');
          if (yamlEndIndex !== -1 && yamlEndIndex + 3 < summary.length) {
            let afterYaml = summary.substring(yamlEndIndex + 3).trim();
            if (afterYaml.length > 10) {
              data.summary = afterYaml;
              break;
            }
          }
          // YAMLのみの場合は次のパターンを試す
          continue;
        }
        
        data.summary = summary;
        break;
      }
    }
  }
  
  return data;
}
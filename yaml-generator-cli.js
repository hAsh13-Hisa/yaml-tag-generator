#!/usr/bin/env node

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function fetchNoteArticle(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractArticleData(html) {
  // タイトル
  const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '';

  // 著者
  const authorMatch = html.match(/<span class="o-noteUser__name">([^<]+)<\/span>/) || 
                     html.match(/<div class="p-author__name">([^<]+)<\/div>/) ||
                     html.match(/<a[^>]*class="[^"]*note-user-name[^"]*"[^>]*>([^<]+)<\/a>/);
  const author = authorMatch ? authorMatch[1].trim() : '';

  // 公開日
  const dateMatch = html.match(/<time datetime="([^"]+)"/) || 
                   html.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
  let publishDate = '';
  if (dateMatch) {
    if (dateMatch[1].includes('年')) {
      publishDate = dateMatch[1];
    } else {
      const date = new Date(dateMatch[1]);
      publishDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
  }

  // ハッシュタグ
  const hashtagMatches = html.matchAll(/<a[^>]*href="\/hashtag\/([^"]+)"[^>]*>#([^<]+)<\/a>/g);
  const tags = [];
  for (const match of hashtagMatches) {
    const tag = match[2] || match[1];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  // 概要
  const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/) ||
                   html.match(/<meta name="description" content="([^"]+)"/);
  const summary = descMatch ? descMatch[1] : '';

  return {
    title,
    author,
    publish_date: publishDate,
    tags,
    summary
  };
}

function convertToYAML(data) {
  const lines = [];
  
  if (data.title) {
    lines.push(`title: "${data.title}"`);
  }
  
  if (data.author) {
    lines.push(`author: "${data.author}"`);
  }
  
  if (data.publish_date) {
    lines.push(`publish_date: "${data.publish_date}"`);
  }
  
  if (data.tags && data.tags.length > 0) {
    lines.push('tags:');
    data.tags.forEach(tag => {
      lines.push(`  - ${tag}`);
    });
  }
  
  if (data.summary) {
    lines.push(`summary: "${data.summary}"`);
  }
  
  return lines.join('\n');
}

async function main() {
  console.log('YAML Tag Generator for note.com');
  console.log('================================\n');

  rl.question('note.comのURLを入力してください: ', async (url) => {
    if (!url.includes('note.com')) {
      console.error('\n❌ エラー: 有効なnote.comのURLを入力してください。');
      rl.close();
      return;
    }

    console.log('\n⏳ ページを取得中...');

    try {
      const html = await fetchNoteArticle(url);
      const data = extractArticleData(html);
      
      console.log('\n✅ 取得完了！\n');
      console.log('=== 抽出された情報 ===');
      console.log(`タイトル: ${data.title || '取得できませんでした'}`);
      console.log(`著者: ${data.author || '取得できませんでした'}`);
      console.log(`公開日: ${data.publish_date || '取得できませんでした'}`);
      console.log(`タグ: ${data.tags.length > 0 ? data.tags.join(', ') : '取得できませんでした'}`);
      console.log(`概要: ${data.summary ? data.summary.substring(0, 100) + '...' : '取得できませんでした'}`);
      
      const yaml = convertToYAML(data);
      
      console.log('\n=== 生成されたYAML ===');
      console.log(yaml);
      
      // YAMLをファイルに保存
      const fs = require('fs');
      const filename = `output_${Date.now()}.yaml`;
      fs.writeFileSync(filename, yaml);
      console.log(`\n📄 YAMLファイルを保存しました: ${filename}`);
      
    } catch (error) {
      console.error('\n❌ エラーが発生しました:', error.message);
    }

    rl.close();
  });
}

main();
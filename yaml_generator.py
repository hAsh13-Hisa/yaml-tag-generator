#!/usr/bin/env python3
import requests
import re
from datetime import datetime
import sys

def fetch_note_article(url):
    """note.comの記事を取得"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except Exception as e:
        raise Exception(f"ページの取得に失敗しました: {str(e)}")

def extract_article_data(html):
    """HTMLから記事データを抽出"""
    data = {
        'title': '',
        'author': '',
        'publish_date': '',
        'tags': [],
        'summary': ''
    }
    
    # タイトル
    title_match = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    if title_match:
        data['title'] = title_match.group(1)
    
    # 著者
    author_patterns = [
        r'<span class="o-noteUser__name">([^<]+)</span>',
        r'<div class="p-author__name">([^<]+)</div>',
        r'<a[^>]*class="[^"]*note-user-name[^"]*"[^>]*>([^<]+)</a>'
    ]
    for pattern in author_patterns:
        author_match = re.search(pattern, html)
        if author_match:
            data['author'] = author_match.group(1).strip()
            break
    
    # 公開日
    date_match = re.search(r'<time datetime="([^"]+)"', html) or re.search(r'(\d{4}年\d{1,2}月\d{1,2}日)', html)
    if date_match:
        date_str = date_match.group(1)
        if '年' in date_str:
            data['publish_date'] = date_str
        else:
            try:
                date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                data['publish_date'] = f"{date_obj.year}年{date_obj.month}月{date_obj.day}日"
            except:
                pass
    
    # 記事内容を取得してYAMLフロントマターをチェック
    article_content = ''
    article_match = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    if article_match:
        article_content = article_match.group(1)
    
    # YAMLフロントマターが既に含まれているかチェック
    has_yaml_frontmatter = ('---' in article_content and 
                           ('title:' in article_content or 
                            'tags:' in article_content or 
                            'author:' in article_content))
    
    # YAMLフロントマターがない場合のみハッシュタグを抽出
    if not has_yaml_frontmatter:
        hashtag_matches = re.findall(r'#([^\s\u3000<]+)', article_content)
        # 重複を除去し、長すぎるタグを除外
        clean_tags = []
        for tag in set(hashtag_matches):
            if tag and len(tag) < 50 and not '\\' in tag:
                clean_tags.append(tag)
        data['tags'] = clean_tags
    else:
        data['tags'] = []
    
    # 概要
    desc_match = re.search(r'<meta property="og:description" content="([^"]+)"', html) or \
                re.search(r'<meta name="description" content="([^"]+)"', html)
    if desc_match:
        data['summary'] = desc_match.group(1)
    
    return data

def convert_to_yaml(data):
    """データをYAML形式に変換"""
    lines = ['---']
    
    if data['title']:
        lines.append(f'title: "{data["title"]}"')
    
    if data['author']:
        lines.append(f'author: "{data["author"]}"')
    
    if data['publish_date']:
        lines.append(f'publish_date: "{data["publish_date"]}"')
    
    if data['tags']:
        lines.append('tags:')
        for tag in data['tags']:
            lines.append(f'  - {tag}')
    
    if data['summary']:
        lines.append(f'summary: "{data["summary"]}"')
    
    lines.append('...')
    
    return '\n'.join(lines)

def main():
    print('YAML Tag Generator for note.com')
    print('=' * 32)
    print()
    
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = input('note.comのURLを入力してください: ')
    
    if 'note.com' not in url:
        print('\n❌ エラー: 有効なnote.comのURLを入力してください。')
        return
    
    print('\n⏳ ページを取得中...')
    
    try:
        html = fetch_note_article(url)
        data = extract_article_data(html)
        
        print('\n✅ 取得完了！\n')
        print('=== 抽出された情報 ===')
        print(f'タイトル: {data["title"] or "取得できませんでした"}')
        print(f'著者: {data["author"] or "取得できませんでした"}')
        print(f'公開日: {data["publish_date"] or "取得できませんでした"}')
        print(f'タグ: {", ".join(data["tags"]) if data["tags"] else "取得できませんでした"}')
        summary_display = data["summary"][:100] + '...' if data["summary"] else "取得できませんでした"
        print(f'概要: {summary_display}')
        
        yaml = convert_to_yaml(data)
        
        print('\n=== 生成されたYAML ===')
        print(yaml)
        
        # YAMLをファイルに保存
        import time
        filename = f'output_{int(time.time())}.yaml'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(yaml)
        print(f'\n📄 YAMLファイルを保存しました: {filename}')
        
    except Exception as e:
        print(f'\n❌ エラーが発生しました: {str(e)}')

if __name__ == '__main__':
    main()
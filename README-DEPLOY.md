# YAML Tag Generator - デプロイガイド

note.comの記事からYAMLメタデータを生成するWebアプリケーションです。

## 機能

- note.comの記事URLから以下の情報を自動抽出:
  - タイトル
  - 著者
  - 公開日
  - ハッシュタグ
  - 概要
- YAML形式で出力
- 「コードとしてコピー」機能（noteにコードブロックとして貼り付け可能）
- 既にYAMLフロントマターが含まれた記事の適切な処理

## デプロイ方法

### 1. Vercel（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

設定ファイル: `vercel.json`

### 2. Netlify

1. Netlifyにリポジトリを接続
2. ビルド設定:
   - Build command: `npm install`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

設定ファイル: `netlify.toml`, `netlify/functions/api.js`

### 3. Heroku

```bash
# Heroku CLIでログイン
heroku login

# アプリを作成
heroku create your-app-name

# デプロイ
git push heroku main
```

### 4. Docker

```bash
# イメージをビルド
docker build -t yaml-tag-generator .

# コンテナを実行
docker run -p 8081:8081 yaml-tag-generator
```

### 5. Render（推奨の無料オプション）

1. [Render](https://render.com)でアカウント作成
2. GitHubリポジトリを接続
3. Web Serviceを作成:
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Auto-Deploy: Yes

設定ファイル: `render.yaml`

### 6. 自サーバー

```bash
# 依存関係をインストール
npm install

# 本番サーバーを起動
npm run server
```

## 環境変数

- `PORT`: サーバーポート（デフォルト: 8081）

## 使用技術

- Backend: Node.js
- Frontend: HTML, JavaScript, Tailwind CSS
- API: note.com スクレイピング

## ライセンス

ISC
# 🏷️ YAML Tag Generator for note.com

note.comの記事からYAMLメタデータを自動生成するWebアプリケーションです。

![YAML Tag Generator](https://img.shields.io/badge/Status-Ready_for_Deploy-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## ✨ 機能

- 📝 **note.com記事の自動解析**: URLを入力するだけで記事情報を抽出
- 🏷️ **YAML形式出力**: 標準的なYAMLフロントマター形式
- 📋 **コードブロックコピー**: noteに貼り付けやすい形式
- 🔍 **既存YAML検出**: 重複を避ける賢い処理
- 📱 **レスポンシブUI**: モバイル・デスクトップ対応

## 🎯 抽出される情報

```yaml
---
title: "記事のタイトル"
author: "著者名"
publish_date: "2025年6月12日"
tags:
  - タグ1
  - タグ2
  - タグ3
summary: "記事の概要文..."
...
```

## 🚀 デプロイ

### Render（推奨）
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. このリポジトリをフォーク
2. Renderでアカウント作成
3. Web Service作成：
   - Build Command: `npm install`
   - Start Command: `npm run server`

### その他のプラットフォーム

- **Vercel**: `vercel.json` 設定済み
- **Netlify**: `netlify.toml` 設定済み
- **Docker**: `Dockerfile` 設定済み
- **Heroku**: Node.js対応

詳細は [DEPLOY-INSTRUCTIONS.md](./DEPLOY-INSTRUCTIONS.md) を参照

## 🛠️ ローカル開発

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動
npm run server

# http://localhost:8081 でアクセス
```

## 📖 使用方法

1. note.comの記事URLを入力
2. 「生成」ボタンをクリック
3. YAMLが自動生成される
4. 「コードとしてコピー」でnoteに貼り付け

### サンプルURL
```
https://note.com/hash_13/n/n3d3895937912
```

## 🔧 技術スタック

- **Backend**: Node.js
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **API**: 記事スクレイピング
- **Deploy**: Render, Vercel, Netlify対応

## 📚 ファイル構成

```
yaml-tag-generator/
├── server.js              # メインサーバー
├── index.html             # フロントエンド
├── render.yaml            # Render設定
├── vercel.json            # Vercel設定
├── netlify.toml           # Netlify設定
├── Dockerfile             # Docker設定
└── package.json           # Node.js設定
```

## 🎨 特徴

- **スマート抽出**: HTMLエンティティの適切な処理
- **YAML検出**: 既存のYAMLフロントマターを検出して重複回避
- **エラーハンドリング**: 詳細なエラーメッセージ
- **高速処理**: 軽量で高速な動作

## 📄 ライセンス

ISC License

## 🤝 コントリビューション

Issues、Pull Requestsをお待ちしています！

---

**🎉 [今すぐ使ってみる →](https://yaml-tag-generator.onrender.com)**
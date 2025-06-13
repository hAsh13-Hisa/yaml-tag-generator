# 🚀 YAML Tag Generator - デプロイ手順

## 📁 プロジェクト準備完了

すべてのファイルがコミット済みです：
```bash
git status
# ✅ すべてのファイルがコミット済み
```

## 🔧 次のステップ

### 1. GitHubリポジトリの作成

**オプションA: GitHub Webサイトで作成**
1. https://github.com/new にアクセス
2. Repository name: `yaml-tag-generator`
3. Description: `Generate YAML metadata from note.com articles with web interface`
4. Public を選択
5. "Create repository" をクリック

**オプションB: GitHub CLI（認証後）**
```bash
gh auth login
gh repo create yaml-tag-generator --public --description "Generate YAML metadata from note.com articles with web interface"
```

### 2. リモートリポジトリに接続
```bash
# GitHubで作成したリポジトリのURLを使用
git remote add origin https://github.com/YOUR_USERNAME/yaml-tag-generator.git
git push -u origin main
```

### 3. Renderでデプロイ

1. **Renderアカウント作成**
   - https://render.com にアクセス
   - "Get Started for Free" をクリック
   - GitHubアカウントで登録

2. **Web Service作成**
   - Dashboard → "New +" → "Web Service"
   - "Connect a repository" → GitHubリポジトリを選択
   - "yaml-tag-generator" を選択

3. **設定**
   ```
   Name: yaml-tag-generator
   Environment: Node
   Build Command: npm install
   Start Command: npm run server
   ```

4. **デプロイ開始**
   - "Create Web Service" をクリック
   - 数分でデプロイ完了

## 🎯 期待される結果

- ✅ 自動的にHTTPS対応のURLが生成される
- ✅ `https://yaml-tag-generator.onrender.com` のような形式
- ✅ note.comのURL入力でYAML生成が可能
- ✅ GitHubプッシュで自動再デプロイ

## 🔍 動作確認

デプロイ後、以下をテスト：
1. note.comのURL: `https://note.com/hash_13/n/n3d3895937912`
2. 「生成」ボタンをクリック
3. YAML出力を確認
4. 「コードとしてコピー」機能をテスト

## 📞 サポート

問題がある場合は、Renderのログを確認：
- Dashboard → Service → "Logs" タブ

---

**🎉 準備完了です！GitHubリポジトリを作成してRenderでデプロイしましょう！**
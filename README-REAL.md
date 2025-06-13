# 実際のデータを取得できるYAML Tag Generator

実際のnote.comからデータを取得できるバージョンです。

## 使い方

1. サーバーを起動:
```bash
./start-real-server.sh
```

2. ブラウザで以下のURLを開く:
```
http://localhost:8080/index-real.html
```

3. note.comの記事URLを入力して「生成」ボタンをクリック

## 仕組み

- Node.jsサーバー（server.js）がプロキシとして動作
- ブラウザからのリクエストを受け取り、サーバー側でnote.comにアクセス
- CORSの制限を回避して実際のデータを取得
- 取得したデータをパースしてYAML形式に変換

## テスト用URL

以下のURLでテストできます：
- https://note.com/hash_13/n/n3d3895937912

## トラブルシューティング

もしサーバーが起動しない場合：
```bash
# Node.jsがインストールされているか確認
node --version

# インストールされていない場合
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
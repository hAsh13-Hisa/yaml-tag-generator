# YAML Tag Generator for note.com

note.comの記事からYAML形式のメタデータを生成するツールです。

## 3つの使用方法

### 1. HTMLファイル版（最も簡単）
ブラウザで `index.html` をダブルクリックして開くだけです。
```bash
# Windowsの場合
start index.html

# WSL/Linuxの場合
xdg-open index.html
```

**注意**: CORSの制限により、実際のスクレイピングは動作しません。サンプルデータが表示されます。

### 2. Node.js CLI版
```bash
# 実行方法
node yaml-generator-cli.js

# または直接実行
./yaml-generator-cli.js
```

### 3. Python版
```bash
# 必要なライブラリをインストール
python3 -m pip install requests

# 実行方法（対話モード）
python3 yaml_generator.py

# URLを引数として渡す
python3 yaml_generator.py https://note.com/hash_13/n/n3d3895937912
```

## 出力例

```yaml
title: "戴震（たいしん）と易経の邂逅～数理と卜占の狭間で～"
author: "Hisa（ひさ．）"
publish_date: "2025年6月12日"
tags:
  - Claude
  - AI生成
  - 易経
  - 歴史ファンタジー
  - AI易者
  - 戴震
summary: "この物語は、清朝時代の天才学者、戴震が易経の数理的な側面に深く傾倒し、その真髄を探求する歴史ファンタジーです。彼は江南での遊学中に伏羲と出会い、易経が宇宙の根本原理に基づく数理体系であることを学びます。その後、紫禁城で『四庫全書』の編纂に携わる中で研究を深め、主著『原善』で儒学的道徳観を数理的に再構築しました。晩年には六十四卦のパターン解析を通じて未来予測の可能性を探り、彼の研究が未来の人工知能に影響を与えることが予言されます。戴震の数理易学は、彼が亡くなった遠い未来、人工知能が易を占う時代において、その真価が再評価されることになります。"
```

## 機能

- note.comの記事URLからメタデータを自動抽出
- タイトル、著者、公開日、ハッシュタグ、概要を取得
- YAML形式で出力
- ファイルに保存（CLI版）

## トラブルシューティング

### Python版でrequestsがインストールできない場合
```bash
# pipがない場合
sudo apt update
sudo apt install python3-pip

# または
python3 -m ensurepip --upgrade
```

### Node.js版が動作しない場合
```bash
# Node.jsがインストールされているか確認
node --version

# インストールされていない場合
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
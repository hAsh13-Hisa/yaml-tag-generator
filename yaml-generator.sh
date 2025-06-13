#!/bin/bash

echo "YAML Tag Generator for note.com"
echo "================================"
echo

# URLを引数から取得、または入力を求める
if [ -n "$1" ]; then
    URL="$1"
else
    read -p "note.comのURLを入力してください: " URL
fi

# URLチェック
if [[ ! "$URL" =~ note\.com ]]; then
    echo -e "\n❌ エラー: 有効なnote.comのURLを入力してください。"
    exit 1
fi

echo -e "\n⏳ ページを取得中..."

# ページを取得
HTML=$(curl -s "$URL")

if [ $? -ne 0 ]; then
    echo -e "\n❌ エラー: ページの取得に失敗しました。"
    exit 1
fi

# データ抽出
TITLE=$(echo "$HTML" | grep -oP '<meta property="og:title" content="\K[^"]+' | head -1)
AUTHOR=$(echo "$HTML" | grep -oP '<span class="o-noteUser__name">\K[^<]+' | head -1)
if [ -z "$AUTHOR" ]; then
    AUTHOR=$(echo "$HTML" | grep -oP '<div class="p-author__name">\K[^<]+' | head -1)
fi
DATE=$(echo "$HTML" | grep -oP '<time datetime="\K[^"]+' | head -1)
if [ -z "$DATE" ]; then
    DATE=$(echo "$HTML" | grep -oP '\d{4}年\d{1,2}月\d{1,2}日' | head -1)
fi
SUMMARY=$(echo "$HTML" | grep -oP '<meta property="og:description" content="\K[^"]+' | head -1)

# ハッシュタグ抽出
TAGS=$(echo "$HTML" | grep -oP '<a[^>]*href="/hashtag/[^"]*"[^>]*>#\K[^<]+' | sort -u)

echo -e "\n✅ 取得完了！\n"
echo "=== 抽出された情報 ==="
echo "タイトル: ${TITLE:-取得できませんでした}"
echo "著者: ${AUTHOR:-取得できませんでした}"
echo "公開日: ${DATE:-取得できませんでした}"
echo -n "タグ: "
if [ -n "$TAGS" ]; then
    echo "$TAGS" | tr '\n' ', ' | sed 's/, $//'
    echo
else
    echo "取得できませんでした"
fi
echo "概要: ${SUMMARY:0:100}${SUMMARY:100:+...}"

# YAML生成
echo -e "\n=== 生成されたYAML ==="
YAML="---\n"
[ -n "$TITLE" ] && YAML="${YAML}title: \"$TITLE\"\n"
[ -n "$AUTHOR" ] && YAML="${YAML}author: \"$AUTHOR\"\n"
[ -n "$DATE" ] && YAML="${YAML}publish_date: \"$DATE\"\n"
if [ -n "$TAGS" ]; then
    YAML="${YAML}tags:\n"
    echo "$TAGS" | while read -r tag; do
        YAML="${YAML}  - $tag\n"
        echo "  - $tag"
    done
fi
[ -n "$SUMMARY" ] && YAML="${YAML}summary: \"$SUMMARY\"\n"
YAML="${YAML}..."

echo -e "$YAML"

# ファイルに保存
FILENAME="output_$(date +%s).yaml"
echo -e "$YAML" > "$FILENAME"
echo -e "\n📄 YAMLファイルを保存しました: $FILENAME"
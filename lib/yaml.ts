export interface ArticleData {
  title: string
  author: string
  publish_date: string
  tags: string[]
  summary: string
}

export function convertToYAML(data: ArticleData): string {
  const yamlLines: string[] = ['---']
  
  // Title
  if (data.title) {
    yamlLines.push(`title: "${data.title}"`)
  }
  
  // Author
  if (data.author) {
    yamlLines.push(`author: "${data.author}"`)
  }
  
  // Publish date
  if (data.publish_date) {
    yamlLines.push(`publish_date: "${data.publish_date}"`)
  }
  
  // Tags
  if (data.tags && data.tags.length > 0) {
    yamlLines.push('tags:')
    data.tags.forEach(tag => {
      yamlLines.push(`  - ${tag}`)
    })
  }
  
  // Summary
  if (data.summary) {
    // YAMLに含まれる特殊文字をエスケープ
    let summary = data.summary;
    summary = summary.replace(/"/g, '\\"'); // ダブルクォートをエスケープ
    summary = summary.replace(/\n/g, ' '); // 改行を削除
    summary = summary.replace(/\r/g, ''); // キャリッジリターンを削除
    
    yamlLines.push(`summary: "${summary}"`)
  }
  
  yamlLines.push('...')
  
  return yamlLines.join('\n')
}
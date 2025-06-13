'use client'

import { useState } from 'react'
import { convertToYAML, ArticleData } from '@/lib/yaml'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [yamlOutput, setYamlOutput] = useState('')
  const [articleData, setArticleData] = useState<ArticleData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setYamlOutput('')
    setArticleData(null)

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape the page')
      }

      setArticleData(data)
      setYamlOutput(convertToYAML(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlOutput)
      .then(() => alert('YAMLをクリップボードにコピーしました！'))
      .catch(() => alert('コピーに失敗しました'))
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          YAML Tag Generator for note.com
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://note.com/..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : '生成'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {articleData && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">抽出された情報</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium text-gray-600">タイトル:</dt>
                  <dd className="text-gray-900">{articleData.title || '取得できませんでした'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">著者:</dt>
                  <dd className="text-gray-900">{articleData.author || '取得できませんでした'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">公開日:</dt>
                  <dd className="text-gray-900">{articleData.publish_date || '取得できませんでした'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">タグ:</dt>
                  <dd className="text-gray-900">
                    {articleData.tags.length > 0 
                      ? articleData.tags.join(', ') 
                      : '取得できませんでした'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">概要:</dt>
                  <dd className="text-gray-900">{articleData.summary || '取得できませんでした'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">生成されたYAML</h2>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  コピー
                </button>
              </div>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                <code>{yamlOutput}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
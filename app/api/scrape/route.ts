import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes('note.com')) {
      return NextResponse.json(
        { error: 'Invalid URL. Please provide a valid note.com URL.' },
        { status: 400 }
      )
    }

    // Fetch the page content
    const response = await fetch(url)
    const html = await response.text()

    // Extract metadata using regex patterns
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/)
    const authorMatch = html.match(/<span class="o-noteUser__name">([^<]+)<\/span>/) || 
                       html.match(/<div class="p-author__name">([^<]+)<\/div>/)
    const dateMatch = html.match(/<time datetime="([^"]+)"/) || 
                     html.match(/(\d{4}年\d{1,2}月\d{1,2}日)/)
    
    // Extract hashtags
    const hashtagMatches = html.matchAll(/<a[^>]*href="\/hashtag\/([^"]+)"[^>]*>#([^<]+)<\/a>/g)
    const tags: string[] = []
    for (const match of hashtagMatches) {
      const tag = match[2] || match[1]
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    // Extract summary/description
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/) ||
                     html.match(/<meta name="description" content="([^"]+)"/)

    // Format date
    let publishDate = ''
    if (dateMatch) {
      if (dateMatch[1].includes('年')) {
        publishDate = dateMatch[1]
      } else {
        const date = new Date(dateMatch[1])
        publishDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      }
    }

    const result = {
      title: titleMatch ? titleMatch[1] : '',
      author: authorMatch ? authorMatch[1].trim() : '',
      publish_date: publishDate,
      tags: tags,
      summary: descMatch ? descMatch[1] : ''
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape the page. Please check the URL and try again.' },
      { status: 500 }
    )
  }
}
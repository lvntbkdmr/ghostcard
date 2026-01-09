export interface GhostPostData {
  title: string
  excerpt: string
  featuredImage: string
  publishedAt: string
  readTime: string
}

function calculateReadTime(text: string): string {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
]

async function fetchWithProxy(url: string): Promise<string> {
  let lastError: Error | null = null

  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url)
      const response = await fetch(proxyUrl, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      if (html && html.length > 100) {
        return html
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      continue
    }
  }

  throw lastError || new Error("All proxies failed")
}

export async function scrapeGhostPost(url: string): Promise<GhostPostData> {
  const html = await fetchWithProxy(url)

  // Parse HTML using DOMParser (browser environment)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Extract title - try multiple selectors common in Ghost themes
  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
    doc.querySelector("h1.post-title")?.textContent ||
    doc.querySelector("h1.article-title")?.textContent ||
    doc.querySelector("h1")?.textContent ||
    doc.querySelector("title")?.textContent ||
    "Untitled Post"

  // Extract excerpt/description
  const excerpt =
    doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
    doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
    doc.querySelector(".post-excerpt")?.textContent ||
    doc.querySelector(".article-excerpt")?.textContent ||
    ""

  // Extract featured image
  const featuredImage =
    doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
    doc.querySelector(".post-image img")?.getAttribute("src") ||
    doc.querySelector(".feature-image img")?.getAttribute("src") ||
    doc.querySelector("article img")?.getAttribute("src") ||
    ""

  // Extract publish date
  const publishDateMeta =
    doc.querySelector('meta[property="article:published_time"]')?.getAttribute("content") ||
    doc.querySelector("time")?.getAttribute("datetime") ||
    doc.querySelector(".post-date")?.textContent ||
    ""
  const publishedAt = publishDateMeta ? formatDate(publishDateMeta) : ""

  // Calculate read time from article content
  const articleContent =
    doc.querySelector(".post-content")?.textContent ||
    doc.querySelector(".article-content")?.textContent ||
    doc.querySelector(".gh-content")?.textContent ||
    doc.querySelector("article")?.textContent ||
    doc.body.textContent ||
    ""
  const readTime = calculateReadTime(articleContent)

  return {
    title: title.trim(),
    excerpt: excerpt.trim(),
    featuredImage,
    publishedAt,
    readTime,
  }
}

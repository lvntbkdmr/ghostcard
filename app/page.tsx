"use client"

import { PostCard, type CardTheme, type CardLayout } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { scrapeGhostPost, type GhostPostData } from "@/lib/scrape-ghost"

interface Post extends GhostPostData {
  author: string
  authorAvatar?: string
}

const DEFAULT_AUTHOR = "Levent Bekdemir"
const DEFAULT_AVATAR = "/images/author-avatar.jpg"

async function imageUrlToDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith("data:") || url.startsWith("/")) {
    return url
  }

  try {
    // Use weserv.nl image proxy which handles CORS and returns proper image data
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error("Failed to convert image to data URL:", err)
    return url
  }
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<CardTheme>("light")
  const [layout, setLayout] = useState<CardLayout>("standard")

  const [post, setPost] = useState<Post>({
    title: "Experiencing Multi-Agent Workflow",
    excerpt:
      "My first 'no-WebSocket ttyd' attempt was a costly, frustrating mess. The real win was my first multi-agent workflow: one Claude Code subagent studied VibeTunnel, the main agent implemented the fix in a loop until it finally worked.",
    featuredImage: "/images/img-5163.jpg",
    author: DEFAULT_AUTHOR,
    authorAvatar: DEFAULT_AVATAR,
    publishedAt: "08 January 2026",
    readTime: "10 min read",
  })

  const handleFetch = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await scrapeGhostPost(url)
      const featuredImageDataUrl = await imageUrlToDataUrl(data.featuredImage)

      setPost({
        ...data,
        featuredImage: featuredImageDataUrl,
        author: DEFAULT_AUTHOR,
        authorAvatar: DEFAULT_AVATAR,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post data")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!cardRef.current) return

    setExporting(true)

    try {
      const backgroundColor = theme === "dark" ? "#111827" : theme === "gradient" ? "#7c3aed" : "#ffffff"
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor,
      })

      const link = document.createElement("a")
      link.download = `${post.title.toLowerCase().replace(/\s+/g, "-")}-story.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to export image:", err)
      setError("Failed to export image. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-balance text-foreground">
            Ghost to Postcard
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Paste your Ghost blog post URL to generate a story card automatically.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Input
            type="url"
            placeholder="https://your-ghost-blog.com/post-slug/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
          <Button onClick={handleFetch} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Fetching..." : "Fetch Post"}
          </Button>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Customization</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(v) => setTheme(v as CardTheme)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select value={layout} onValueChange={(v) => setLayout(v as CardLayout)}>
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Preview</h2>
            <Button onClick={handleExport} disabled={exporting} className="gap-2">
              {exporting && <Loader2 className="h-4 w-4 animate-spin" />}
              <Download className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export as PNG"}
            </Button>
          </div>
          <div className="flex items-center justify-center rounded-lg border bg-muted/30 p-4">
            <div ref={cardRef}>
              <PostCard post={post} theme={theme} layout={layout} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

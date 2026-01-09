import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

export type CardTheme = "light" | "dark" | "gradient"
export type CardLayout = "standard" | "overlay" | "minimal"

interface Post {
  title: string
  excerpt: string
  featuredImage: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: string
}

interface PostCardProps {
  post: Post
  className?: string
  theme?: CardTheme
  layout?: CardLayout
}

const themeStyles: Record<CardTheme, { card: string; text: string; muted: string; border: string }> = {
  light: {
    card: "bg-white",
    text: "text-gray-900",
    muted: "text-gray-500",
    border: "bg-gray-200",
  },
  dark: {
    card: "bg-gray-900",
    text: "text-white",
    muted: "text-gray-400",
    border: "bg-gray-700",
  },
  gradient: {
    card: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    text: "text-white",
    muted: "text-white/80",
    border: "bg-white/30",
  },
}

export function PostCard({ post, className, theme = "light", layout = "standard" }: PostCardProps) {
  const styles = themeStyles[theme]

  if (layout === "overlay") {
    return (
      <Card className={cn("relative flex flex-col overflow-hidden border-0", "w-[360px]", className)}>
        <div className="relative aspect-[9/16] w-full">
          <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="space-y-3">
              <h2 className="text-balance text-2xl font-bold leading-tight">{post.title}</h2>
              <p className="text-pretty text-sm leading-relaxed text-white/80">{post.excerpt}</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="h-px bg-white/30" />

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                  <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{post.author}</p>
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (layout === "minimal") {
    return (
      <Card className={cn("relative flex flex-col overflow-hidden border", styles.card, "w-[360px]", className)}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <CardContent className="p-6 text-center">
          <h2 className={cn("text-balance text-2xl font-bold leading-tight", styles.text)}>{post.title}</h2>
          <p className={cn("mt-3 text-sm font-medium", styles.muted)}>{post.author}</p>
          <p className={cn("text-xs", styles.muted)}>{post.publishedAt}</p>
        </CardContent>
      </Card>
    )
  }

  // Standard layout (default)
  return (
    <Card className={cn("relative flex flex-col overflow-hidden border", styles.card, "w-[360px]", className)}>
      <div className="relative aspect-video w-full overflow-hidden">
        <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <h2 className={cn("text-balance text-2xl font-bold leading-tight", styles.text)}>{post.title}</h2>
          <p className={cn("text-pretty text-sm leading-relaxed", styles.muted)}>{post.excerpt}</p>
        </div>

        <div className="mt-4 space-y-3">
          <div className={cn("h-px", styles.border)} />

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
              <AvatarFallback className={cn("text-sm font-semibold", theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600")}>
                {post.author.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className={cn("text-sm font-semibold", styles.text)}>{post.author}</p>
              <div className={cn("flex items-center gap-3 text-xs", styles.muted)}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

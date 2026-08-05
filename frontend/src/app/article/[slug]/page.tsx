import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { ShareButton } from "@/components/share-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { LikeButton } from "@/components/like-button"
import { ReadingProgressBar } from "@/components/reading-progress-bar"
import { articles } from "@/lib/mock-data"
import { ArrowLeft, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

const CATEGORY_ACCENT: Record<string, string> = {
  Research: "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50",
  Industry: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50",
  Policy: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50",
  Hardware: "text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/50",
}

const CATEGORY_GRADIENT: Record<string, string> = {
  Research: "from-indigo-600/80 to-purple-600/60",
  Industry: "from-blue-600/80 to-cyan-600/60",
  Policy: "from-amber-500/80 to-orange-600/60",
  Hardware: "from-pink-600/80 to-rose-600/60",
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      url: `https://ai-news.vercel.app/article/${article.slug}`,
      siteName: "AI News",
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  // Related articles: same category, different slug, up to 3
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3)

  const accentClass = CATEGORY_ACCENT[article.category] ?? "text-muted-foreground border-border bg-muted"
  const gradientClass = CATEGORY_GRADIENT[article.category] ?? "from-slate-600/80 to-slate-800/60"

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen">
      <ReadingProgressBar />

      {/* Hero image with gradient overlay */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[480px] overflow-hidden bg-muted">
        {article.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center text-white/10">
            <span className="font-extrabold text-9xl tracking-tighter select-none">AI</span>
          </div>
        )}
        {/* Deep gradient overlay for text on top */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} via-black/20 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Article content */}
      <article className="container max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-16">

        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="rounded-full text-sm font-medium hover:bg-muted/80 -ml-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
        </div>

        {/* Article header card */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-lg space-y-5">

          {/* Meta row: category + date + reading time */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border ${accentClass}`}>
              {article.category}
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <time className="text-xs text-muted-foreground" dateTime={article.publishedAt}>
              {formattedDate}
            </time>
            {article.readingTime && (
              <>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {article.readingTime} min read
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {article.title}
          </h1>

          {/* Source attribution */}
          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-muted-foreground">
                {article.source.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{article.source}</p>
              <p className="text-xs text-muted-foreground">Publisher</p>
            </div>
          </div>

          {/* Summary body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Drop cap first letter */}
            <p className="text-base sm:text-lg leading-[1.85] text-foreground/90 first-letter:text-5xl first-letter:font-extrabold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-primary">
              {article.summary}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2" aria-label="Article tags">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full text-xs font-medium px-3 py-1">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40">
            <Button asChild className="flex-1 rounded-xl font-semibold gap-2">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Read Full Article
              </a>
            </Button>
            <LikeButton articleId={article.id} variant="button" className="flex-1" />
            <BookmarkButton articleId={article.id} variant="button" className="flex-1" />
            <ShareButton />
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-14" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="related-heading"
                className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400"
              >
                Related Articles
              </h2>
              <Link
                href="/"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}

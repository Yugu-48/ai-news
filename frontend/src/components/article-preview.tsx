import Link from "next/link"
import type { Article } from "@/lib/types"
import { ArticleCard } from "./article-card"
import { StoryImage } from "./story-image"
import { BookmarkButton } from "./bookmark-button"
import { LikeButton } from "./like-button"
import { ShareButton } from "./share-button"
import { ReadingProgressBar } from "./reading-progress-bar"

export function ArticlePreview({ article, related }: { article: Article; related: Article[] }) {
  return <div className="article-preview">
    <ReadingProgressBar />
    <Link href="/news" className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary">← Back to news</Link>
    <article className="news-story" data-category={article.category}>
      <div className="story-meta"><span className="category-label">{article.category}</span><span>{article.source}</span><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Kolkata" })}</time></div>
      <h1 className="editorial-heading">{article.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">Published by {article.source}. This page contains a source excerpt.</p>
      {article.category !== "Research" && <StoryImage article={article} eager />}
      <h2 className="desk-label mt-7 mb-3">{article.category === "Research" ? "Source abstract / excerpt" : "Source excerpt"}</h2>
      <p className="preview-excerpt">{article.summary || "No excerpt was provided. Read the original publication below."}</p>
      {article.tags.length > 0 && <p className="text-sm text-muted-foreground mt-4" aria-label="Article tags">{article.tags.map(tag => `#${tag}`).join(" · ")}</p>}
      <div className="preview-actions">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold px-3 py-2">Read original publication ↗</a>
        <BookmarkButton articleId={article.id} article={article} variant="button" />
        <LikeButton articleId={article.id} article={article} variant="button" />
        <ShareButton />
      </div>
    </article>
    {related.length > 0 && <section className="mt-10 border-t border-border pt-6" aria-labelledby="related-heading"><h2 id="related-heading" className="desk-label mb-4">Related source stories</h2>{related.map(item => <ArticleCard key={item.id} article={item} variant="row" restrained={item.category === "Research"} />)}</section>}
  </div>
}

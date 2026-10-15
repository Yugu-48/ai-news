import Link from "next/link"
import type { Article } from "@/lib/types"
import { categoryPages, feedCategories, matchesCategory, type FeedView } from "@/lib/feed-model"

export function TopicOverview({ articles, active }: { articles: Article[]; active: FeedView }) {
  const topics = feedCategories.filter(category => category !== "All News")
  return <aside className="topic-overview" aria-labelledby="topics-heading">
    <h2 id="topics-heading" className="desk-label">Explore this feed</h2>
    <p className="text-xs text-muted-foreground mt-2 mb-3">{articles.length} stories. Topics overlap.</p>
    <nav aria-label="Explore topics" className="space-y-1">
      {topics.map(topic => {
        const count = articles.filter(article => matchesCategory(article, topic)).length
        return <Link key={topic} href={categoryPages[topic].href} prefetch={true} aria-current={active === topic ? "page" : undefined} className="topic-link">
          <span className="flex items-center justify-between gap-2 text-xs font-semibold"><span>{topic}</span><span className="font-mono text-muted-foreground">{count}</span></span>
          <span className="topic-track" aria-hidden="true"><span style={{ width: `${articles.length ? count / articles.length * 100 : 0}%` }} /></span>
        </Link>
      })}
    </nav>
    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">Counts cover this feed.</p>
  </aside>
}

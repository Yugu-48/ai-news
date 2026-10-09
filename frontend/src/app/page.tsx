import { fetchArticles } from "@/lib/articles"
import { HomeFeed } from "@/components/home-feed"
import { TrendingTicker } from "@/components/trending-ticker"
import { isFeedCategory } from "@/lib/categories"

export const dynamic = "force-dynamic"

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const articles = await fetchArticles()
  const categoryParam = (await searchParams).category
  const initialCategory = isFeedCategory(categoryParam) ? categoryParam : "All News"

  return <><TrendingTicker articles={articles} /><HomeFeed key={initialCategory} initialArticles={articles} initialCategory={initialCategory} /></>
}

import { fetchArticles } from "@/lib/articles"
import { HomeFeed } from "@/components/home-feed"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const articles = await fetchArticles()

  return <HomeFeed initialArticles={articles} />
}

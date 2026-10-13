import { fetchArticles } from "@/lib/articles"
import { HomeFeed } from "@/components/home-feed"
import { redirect } from "next/navigation"
import { categoryPages, isFeedCategory } from "@/lib/categories"

export const dynamic = "force-dynamic"

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const categoryParam = (await searchParams).category
  if (isFeedCategory(categoryParam)) redirect(categoryPages[categoryParam].href)
  const articles = await fetchArticles()

  return <><HomeFeed initialArticles={articles} initialView="All News" /></>
}


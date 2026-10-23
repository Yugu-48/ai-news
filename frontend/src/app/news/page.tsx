import type { Metadata } from "next"
import { fetchArticles } from "@/lib/articles"
import { categoryPages } from "@/lib/categories"
import { HomeFeed } from "@/components/home-feed"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "All News",
  description: categoryPages["All News"].description,
}

export default async function AllNewsPage() {
  const articles = await fetchArticles()
  return <><HomeFeed initialArticles={articles} initialView="All News" /></>
}


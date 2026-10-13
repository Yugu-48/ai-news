import type { Metadata } from "next"
import { fetchArticles } from "@/lib/articles"
import { HomeFeed } from "@/components/home-feed"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Liked", description: "AI News stories you liked." }
export default async function LikedPage() {
  return <HomeFeed initialArticles={await fetchArticles()} initialView="Liked" />
}

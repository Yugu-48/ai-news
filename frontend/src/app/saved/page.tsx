import type { Metadata } from "next"
import { fetchArticles } from "@/lib/articles"
import { HomeFeed } from "@/components/home-feed"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Saved", description: "Your AI News reading list." }
export default async function SavedPage() {
  return <HomeFeed initialArticles={await fetchArticles()} initialView="Saved" />
}

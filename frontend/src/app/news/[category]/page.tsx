import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchArticles } from "@/lib/articles"
import { categoryFromSlug, categoryPages } from "@/lib/categories"
import { HomeFeed } from "@/components/home-feed"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categoryFromSlug((await params).category)
  if (!category) notFound()
  return { title: category, description: categoryPages[category].description }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryFromSlug((await params).category)
  if (!category) notFound()
  const articles = await fetchArticles()


  return <><HomeFeed key={category} initialArticles={articles} initialView={category} /></>
}


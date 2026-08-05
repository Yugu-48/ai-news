export interface Article {
  id: string
  title: string
  source: string
  summary: string
  publishedAt: string
  url: string
  tags: string[]
  slug: string
  category: "Research" | "Industry" | "Policy" | "Hardware"
  imageUrl?: string
  readingTime?: number
}

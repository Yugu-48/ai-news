import { SkeletonCard } from "@/components/ui/skeleton-card"

export default function Loading() {
  return <div className="desk-shell" aria-busy="true" aria-label="Loading AI news">
    <div className="h-10 w-48 skeleton rounded-sm mb-4" />
    <div className="h-5 w-96 max-w-full skeleton rounded-sm mb-5" />
    <div className="h-11 w-full skeleton rounded-sm mb-8" />
    <div className="news-card-grid">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div>
  </div>
}

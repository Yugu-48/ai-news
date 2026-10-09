import { SkeletonCard } from "@/components/ui/skeleton-card"

export default function Loading() {
  return (
    <div className="container max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 space-y-8" aria-busy="true" aria-label="Loading AI news">
      <div className="space-y-4">
        <div className="h-4 w-28 rounded skeleton" />
        <div className="h-12 w-72 max-w-full rounded skeleton" />
        <div className="h-5 w-96 max-w-full rounded skeleton" />
      </div>
      <div className="h-14 w-full rounded-2xl skeleton" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}
      </div>
    </div>
  )
}

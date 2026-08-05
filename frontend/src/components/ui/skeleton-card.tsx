export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden h-full flex flex-col space-y-4 p-4">
      <div className="w-full aspect-video rounded-xl skeleton" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 rounded skeleton" />
        <div className="h-6 w-5/6 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-4/5 rounded skeleton" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-5 w-14 rounded-full skeleton" />
        <div className="h-5 w-14 rounded-full skeleton" />
      </div>
    </div>
  )
}

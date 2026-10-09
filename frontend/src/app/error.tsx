"use client"

import { useEffect } from "react"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("News page failed:", error) }, [error])
  return (
    <div className="container max-w-2xl mx-auto px-4 py-24 text-center space-y-5" role="alert">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Feed unavailable</p>
      <h1 className="text-3xl font-bold">We could not load the news right now.</h1>
      <p className="text-muted-foreground">The sources may be temporarily unavailable. Please try again.</p>
      <button type="button" onClick={reset} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Try again</button>
    </div>
  )
}

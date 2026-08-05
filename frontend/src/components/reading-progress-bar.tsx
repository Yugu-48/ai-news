"use client"

import { useEffect, useState } from "react"

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const pct = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100))
        setCompletion(pct)
      } else {
        setCompletion(0)
      }
    }

    window.addEventListener("scroll", updateScrollCompletion, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollCompletion)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  )
}

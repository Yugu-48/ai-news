"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <Button
      variant={copied ? "default" : "outline"}
      className={`flex-1 rounded-xl font-semibold gap-2 transition-all ${
        copied ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
      }`}
      onClick={handleShare}
      aria-label={copied ? "Link copied to clipboard" : "Share article link"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-white" aria-hidden="true" />
          <span>Copied Link!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span>Share Article</span>
        </>
      )}
    </Button>
  )
}

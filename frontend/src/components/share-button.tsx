"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const [manualLink, setManualLink] = useState<string | null>(null)

  const handleShare = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(window.location.href)
      setManualLink(null)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setManualLink(window.location.href)
    }
  }

  return (
    <div className="flex-1 space-y-2">
    <Button
      variant={copied ? "default" : "outline"}
      className={`w-full rounded-xl font-semibold gap-2 transition-all ${
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
    {manualLink && <label className="block text-xs text-muted-foreground">
      Copy this article link manually:
      <input aria-label="Article link to copy" className="w-full min-h-11 mt-1 p-2 border rounded-md bg-background" value={manualLink} readOnly onFocus={event => event.currentTarget.select()} />
    </label>}
    </div>
  )
}


"use client"

import { useEffect, useRef } from "react"
import { Mail, X } from "lucide-react"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement
    closeButton.current?.focus()
    return () => { if (previousFocus instanceof HTMLElement) previousFocus.focus() }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onKeyDown={event => {
      if (event.key === "Escape") onClose()
      if (event.key === "Tab") { event.preventDefault(); closeButton.current?.focus() }
    }}>
      <div role="dialog" aria-modal="true" aria-labelledby="newsletter-title" aria-describedby="newsletter-description" className="relative w-full max-w-md bg-card border border-border rounded-xl p-8 space-y-5">
        <button ref={closeButton} type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted" aria-label="Close newsletter modal"><X className="h-4 w-4" /></button>
        <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
        <h2 id="newsletter-title" className="text-2xl font-semibold">Newsletter preview</h2>
        <p id="newsletter-description" className="text-sm text-muted-foreground leading-relaxed">Email delivery is not connected in this prototype. No email addresses are collected and no subscription is created. You can read the latest stories on the site or use the RSS feed.</p>
      </div>
    </div>
  )
}

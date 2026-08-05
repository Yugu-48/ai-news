"use client"

import { useState } from "react"
import { Mail, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail("")
        onClose()
      }, 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Close newsletter modal"
        >
          <X className="h-4 w-4" />
        </button>

        {subscribed ? (
          <div className="py-6 text-center space-y-3 animate-fade-in">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-foreground">You're Subscribed!</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for subscribing to AI News weekly digest. Check your inbox soon!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-center sm:text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Stay Ahead in AI
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join 15,000+ researchers, engineers, and founders getting our curated weekly breakdown of breakthroughs and industry shifts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button type="submit" className="w-full h-11 rounded-xl font-semibold">
                Subscribe Free
              </Button>
            </form>

            <p className="text-[11px] text-center text-muted-foreground/70">
              Zero spam. Unsubscribe at any time with one click.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

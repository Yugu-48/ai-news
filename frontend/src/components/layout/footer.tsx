"use client"

import { useState } from "react"
import Link from "next/link"
import { Rss } from "lucide-react"
import { NewsletterModal } from "@/components/newsletter-modal"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <NewsletterModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <footer className="relative mt-auto border-t border-border/40 bg-card/50 backdrop-blur-sm">
      {/* Animated gradient top line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 30%, hsl(267 84% 81%) 70%, transparent 100%)",
        }}
      />

      <div className="container max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                AI News
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your daily digest of the most important developments in artificial intelligence — curated from trusted sources worldwide.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href="/rss"
                aria-label="RSS Feed"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Rss className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Explore
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Research", href: "/?category=Research" },
                { label: "Industry", href: "/?category=Industry" },
                { label: "Policy", href: "/?category=Policy" },
                { label: "Hardware", href: "/?category=Hardware" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-0.5 inline-block"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Newsletter CTA */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get a weekly digest of the top AI stories delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email for newsletter"
                className="flex-1 h-9 px-3 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground/60">
              No spam, unsubscribe any time.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} AI News. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Next.js
            </a>
            {" · "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Tailwind
            </a>
            {" · "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Shadcn/UI
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { categoryPages, feedCategories } from "@/lib/categories"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X, Bookmark, Heart } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

const NAV_LINKS = [...feedCategories.map(label => ({ label, href: categoryPages[label].href })), { label: "Saved", href: "/saved" }, { label: "Liked", href: "/liked" }]
const subscribe = () => () => {}
export function Navbar() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const active = (href: string) => pathname === href || (href === "/news" && pathname === "/")
  const reset = (href: string) => { setMobileOpen(false); if (active(href)) window.dispatchEvent(new Event("ai-news-reset-feed")) }
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMobileOpen(false); menuButton.current?.focus() } }
    window.addEventListener("keydown", escape)
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", escape) }
  }, [mobileOpen])
  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
      <Link href="/news" prefetch={true} onClick={() => reset("/news")} className="editorial-heading text-2xl min-h-11 shrink-0 flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true" />AI News</Link>
      <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 min-w-0">
        {NAV_LINKS.slice(0,8).map(({ label, href }) => <Link key={href} href={href} prefetch={true} onClick={() => reset(href)} aria-current={active(href) ? "page" : undefined} className={`min-h-11 flex items-center px-1.5 text-[11px] xl:text-xs font-semibold border-b-2 whitespace-nowrap ${active(href) ? "text-primary border-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</Link>)}
      </nav>
      <div className="flex items-center gap-1 shrink-0">
        <Link href="/saved" prefetch={true} onClick={() => reset("/saved")} aria-label="Saved articles" aria-current={active("/saved") ? "page" : undefined} className={`h-11 w-11 flex items-center justify-center rounded-md ${active("/saved") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}><Bookmark className="w-4 h-4" /></Link>
        <Link href="/liked" prefetch={true} onClick={() => reset("/liked")} aria-label="Liked articles" aria-current={active("/liked") ? "page" : undefined} className={`h-11 w-11 flex items-center justify-center rounded-md ${active("/liked") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}><Heart className="w-4 h-4" /></Link>
        <button type="button" aria-label="Toggle color theme" className="h-11 w-11 flex items-center justify-center rounded-md hover:bg-muted" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{mounted && (resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}</button>
        <button ref={menuButton} type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="lg:hidden h-11 w-11 flex items-center justify-center hover:bg-muted rounded-md" onClick={() => setMobileOpen(value => !value)}>{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
    </div>
    {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden border-t border-border p-4 grid grid-cols-2 gap-1 max-h-[70vh] overflow-auto">{NAV_LINKS.map(({ label, href }) => <Link key={href} href={href} prefetch={true} onClick={() => reset(href)} aria-current={active(href) ? "page" : undefined} className={`min-h-11 py-3 px-4 text-sm rounded-md ${active(href) ? "text-primary bg-primary/10" : "hover:bg-muted"}`}>{label}</Link>)}</nav>}
  </header>
}


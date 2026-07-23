"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              AI News
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link
              href="/"
              className="transition-colors hover:text-foreground text-foreground/80"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-muted/80 transition-colors"
            title="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-all" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-900 transition-all" />
              )
            ) : (
              <span className="h-[1.2rem] w-[1.2rem] block" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

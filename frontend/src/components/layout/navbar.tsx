"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            AI News
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

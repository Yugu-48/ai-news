import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container max-w-4xl py-24 px-4 text-center space-y-8 animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
        <Compass className="h-10 w-10 animate-spin-slow" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          404 Error
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
          The article or page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
      </div>

      <div className="pt-4">
        <Button asChild className="rounded-full px-6 font-semibold gap-2 shadow-lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to AI News Feed
          </Link>
        </Button>
      </div>
    </div>
  )
}

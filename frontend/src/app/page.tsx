import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16">
        <h1 className="text-4xl font-bold tracking-tight">
          AI News
        </h1>
        <p className="text-lg text-muted-foreground">
          Your daily dose of AI news and insights
        </p>
        <div className="flex gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </main>
    </div>
  )
}

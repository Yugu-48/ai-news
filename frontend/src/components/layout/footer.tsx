export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-center gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js, Tailwind CSS, and Shadcn/UI.
        </p>
      </div>
    </footer>
  )
}

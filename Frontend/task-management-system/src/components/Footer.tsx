import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
        </div>
        <div className="flex items-center space-x-1">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Inicio
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">
            About
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/dashboards" className="text-sm text-muted-foreground hover:underline">
            Dashboards
          </Link>
        </div>
        <div className="flex items-center space-x-1">
          <Link href="https://github.com/Russell-Nunez" target="_blank" rel="noreferrer">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}


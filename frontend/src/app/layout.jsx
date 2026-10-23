// src/app/layout.jsx
// The root layout: wraps EVERY page with the same header and footer.
// This is a Server Component (no "use client"), so it can export metadata.

import Link from "next/link";
import "./globals.css";

// Sets the <title> and description of the page
export const metadata = {
  title: "AI News",
  description: "Your daily dose of AI news and insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Header with the site name and navigation (stays on top: position sticky) */}
        <header className="site-header">
          <Link href="/" className="logo">AI News</Link>
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/saved">Saved</Link>
          </nav>
        </header>

        {/* The current page is placed here */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <p>AI News · headlines from Hacker News and TechCrunch</p>
        </footer>
      </body>
    </html>
  );
}

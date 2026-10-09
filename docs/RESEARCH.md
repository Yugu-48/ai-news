# Research and decisions — 2026-10-09

Reviewed the public home/category pages of [TechCrunch AI](https://techcrunch.com/category/artificial-intelligence/), [The Decoder](https://the-decoder.com/), [Hugging Face Papers](https://huggingface.co/papers), [The Verge AI](https://www.theverge.com/ai-artificial-intelligence), and [The Rundown AI](https://www.therundown.ai/). Techmeme timed out in the research tool and was not used for specific design claims.

The useful patterns are clear editorial hierarchy, visible publication time and source, compact topic navigation, and a separate discovery path for papers. The existing AI News design already has a large hero, card grid, dark/light tokens and search. This pass retained them, expanded topic lenses and removed fabricated news from the live feed. Screenshots in `docs/screenshots/` show the current desktop and a limited headless narrow-window check; further mobile interaction testing is needed.

The data stack remains Next.js + Prisma + PostgreSQL. `fast-xml-parser` was added because Node.js has no built-in RSS/Atom XML parser; a structured parser is safer than regular expressions for feed metadata. No separate backend is needed.

# Editorial news desk

Implemented for the local teacher-demo prototype on 2026-10-12–13. The existing Next.js/React/Prisma architecture, real source ingestion and Article/API schemas are preserved. No dependencies, accounts, AI-summary services or database migrations were added.

## Design

The original cream/ink/forest identity and charcoal dark theme use local Georgia, Segoe UI/Arial and Consolas fonts. Muted category accents come from shared CSS tokens. The desktop layout is a 12-column lead/latest/topic desk (6/4/2); the lead headline appears before its image, the next five stories appear as compact rows, and remaining stories form a three-column grid without duplicates. Below 1024px the topic overview moves beneath the content; below 768px the lead and latest rows stack. Content is limited to 1440px with 16px phone/32px desktop gutters.

Research views emphasize source abstracts/excerpts and omit decorative images. Article preview text is 720px wide on desktop, with title/attribution before imagery and a clear original-publication link. Reusable lead/card/row variants share Save/Like controls and image fallbacks. Fallback photographs are explicitly illustrative. Source excerpts are not generated summaries or peer-review claims.

Patterns researched: [The Verge](https://www.theverge.com/) for major-story/latest/topic separation; [Quanta Magazine](https://www.quantamagazine.org/) for research attribution and reading lists; [The Pudding](https://pudding.cool/) for useful content exploration. The design does not copy their branding or assets.

## Reader behavior

- Eight topic URLs are retained. `/saved` and `/liked` have their own page titles and navigation. Existing browser-stored IDs and selected metadata remain unchanged; collections default to Compact unless a layout preference exists.
- Source, search and available tag filters combine. Empty tag controls are hidden. Clear Filters stays on the current route. Editorial/Compact persists under `ai_news_feed_layout`; browser storage restrictions fall back to session state.
- Collection totals count available unique stories independently of active filters. Result summaries count shown stories. Unavailable older ID-only references remain preserved and explained separately. Archived cards open the original publisher.
- Explore This Feed derives counts from the displayed source snapshot using existing category rules. Topics overlap; counts cover the loaded feed rather than the entire AI industry. No popularity/trend scores or historical charts are invented.

## Updates and performance

Exactly one polling interval per mounted view checks `/api/articles?limit=50` every 60 seconds. Hidden documents skip checks; simultaneous ticks cannot overlap; unmount aborts the request. The existing server cache and eight-second source timeout are unchanged. Incoming results become a pending snapshot, leaving visible stories steady until the reader clicks N New Stories or Feed Updated. Applying preserves filters/collections and focuses the results heading without scrolling. Failed checks keep stories and offered updates intact with a nonblocking status message. Archived stories already visible in a collection are not counted as new when they reappear in the source feed.

Reader inputs/selects/layout buttons are disabled only during initial hydration so an immediate first interaction cannot be lost before React handlers are attached. Local fonts and CSS topic bars add no outbound font fetches, chart libraries or animation framework. Dimensions are reserved for imagery, below-fold images are lazy, and the lead image is eager. Reduced motion and visible focus styles are supported.

## Verification

The source of truth for exact run commands, final results, screenshots and remaining limits is TASKS.md. The tests include combined filters, collection versus shown counts, layout defaults, snapshot fingerprints, explicit update application, failure retention, hidden/overlapping polling and abort on navigation, in addition to existing ingestion/cache/selection tests.

From frontend: `node --experimental-strip-types --test tests/*.test.mjs`, `node node_modules/typescript/bin/tsc --noEmit`, focused ESLint and `node scripts/verify-preview.mjs` against the running production app. From project root: `node start-demo.mjs` builds changed source and starts the localhost teacher demo; `--rebuild` forces rebuilding and `--port=3001` handles an occupied port.

Newsletter remains an honest preview; account sync, authenticated PostgreSQL ingestion, scheduler and historical analytics remain outside this implementation. Current feed data and remote images require internet; selected snapshots are browser-local, while the server feed cache is memory-only.

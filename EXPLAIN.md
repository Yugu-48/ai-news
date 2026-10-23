# EXPLAIN.md - AI News (simple version, branch `simple`)

All paths are inside `frontend/`. Line numbers are for the files as committed on this branch.

## 1. How to run
```
cd frontend
pnpm install        # (or: npm install)
pnpm dev            # development, http://localhost:3000
pnpm build          # production build
pnpm start          # run the production build, http://localhost:3000
```
- No `.env`, no database, no API keys needed. Needs internet for live news.
- Offline? It shows 10 sample articles instead (made-up demo text, titles start with "[Sample]"). To test that: `NEWS_OFFLINE=1 pnpm start`.
- Change port: `pnpm dev -p 4000` (or edit `package.json` lines 6 and 8: `"next dev -p 4000"`, `"next start -p 4000"`).
- Switch versions: `git checkout main` (full old project) / `git checkout simple` (this one).

## 2. What each file does
| File | What it does |
|---|---|
| `package.json` | Project name, scripts (dev/build/start), 4 dependencies: next, react, react-dom, fast-xml-parser |
| `next.config.js` | Empty Next.js config |
| `jsconfig.json` | Makes `@/` mean `src/` in imports |
| `pnpm-workspace.yaml` | Tells pnpm not to run sharp's install script (so `pnpm install` finishes cleanly) |
| `src/app/layout.jsx` | Header, nav, footer around every page; page title |
| `src/app/page.jsx` | Home page: fetches news, search box, source dropdown, Refresh, Save |
| `src/app/saved/page.jsx` | /saved page: lists saved articles, Remove |
| `src/app/api/news/route.js` | REST API `GET /api/news` (JSON), optional `?q=` and `?source=` |
| `src/components/ArticleCard.jsx` | One news card (props: article, isSaved, onToggleSave) |
| `src/lib/news.js` | Fetches Hacker News (JSON) and TechCrunch (RSS/XML), merges them, fallback to sample data |
| `src/lib/sample-news.json` | 10 sample articles used when both sources fail |
| `src/app/globals.css` | The only stylesheet; colours are variables at the top |
| `public/placeholder.svg` | Picture used when an article has no image |

## 3. What changed from main
- TypeScript -> plain JavaScript (`.tsx`/`.ts` -> `.jsx`/`.js`, `tsconfig.json` -> `jsconfig.json`).
- Tailwind 4 + shadcn `ui/` components (+ clsx, cva, tailwind-merge) -> one plain `globals.css`. Same colours and fonts (paper background, ink text, forest green). Dark theme removed.
- Database removed: Prisma, Supabase, ingest, cron, `/api/ingest`, `/api/status`, `/api/articles`. Saved articles stay in browser localStorage.
- 4 sources -> 2: arXiv and Hugging Face dropped; Hacker News + TechCrunch kept. All in one file `news.js`.
- Added offline fallback (`sample-news.json`, made from the old `mock-data.ts`).
- Pages removed: article/[slug] (cards now link to the publisher), news/[category], /liked, /rss, error/loading.
- Features removed: theme toggle, layout toggle, likes, share, trending ticker, reading progress bar, newsletter modal, feed poller, image resolver, lucide icons, custom hooks.
- Tests, scripts, vercel.json, eslint config, docs/, planning files, graphify, .skills etc. removed (still on `main`).
- Rewritten (not just trimmed): page.jsx, layout.jsx, saved/page.jsx, news.js, route.js, globals.css, ArticleCard.jsx. They are much shorter versions of the old ones.

## 4. How the app works, step by step
1. You open `http://localhost:3000`. Next.js runs `layout.jsx` (header/footer) and puts `page.jsx` inside `<main>`.
2. The browser runs `page.jsx`. `useEffect` (page.jsx:35) runs once and calls `loadNews()` (line 21) and reads saved articles from localStorage.
3. `loadNews()` does `fetch("/api/news")` (line 25).
4. The route handler `route.js` runs on the server and calls `getNews()` from `news.js`.
5. `getNews()` (news.js:66) fetches Hacker News (JSON) and TechCrunch (RSS/XML) at the same time, converts both to the same shape, sorts newest first. If both fail it returns `sample-news.json`.
6. `route.js` sends the list back as JSON (line 22). `response.json()` turns it into a JS array and `setArticles` stores it (page.jsx:27).
7. React re-renders: `visible` (page.jsx:55) filters by source dropdown and search text, then `.map` draws one `ArticleCard` each.
8. Click "Save": `toggleSave` (page.jsx:41) adds/removes the article in the `saved` state and writes it to localStorage. `/saved` reads the same localStorage key and shows them.

## 5. "Teacher asks -> change this"
| Teacher asks | File:line | What to type |
|---|---|---|
| Change tab title | `layout.jsx:10` | `title: "My News",` |
| Change site name (header) | `layout.jsx:20` | change text `AI News` |
| Change main heading | `page.jsx:61` | `<h1>Your text</h1>` |
| Change saved page heading | `saved/page.jsx:28` | `<h1>Your text</h1>` |
| Change Refresh button text | `page.jsx:76` | `<button onClick={loadNews}>Reload</button>` |
| Change Save button text | `ArticleCard.jsx:25` | `{isSaved ? "Saved!" : "Save it"}` |
| Search placeholder | `page.jsx:67` | `placeholder="Find..."` |
| Validation limit | `page.jsx:9` | `const MIN_SEARCH_LENGTH = 3;` |
| Validation message | `page.jsx:81` | change the text in the `<p className="error">` |
| Main colour | `globals.css:8` | `--main: red;` |
| Background colour | `globals.css:5` | `--bg: #ffffff;` |
| Text colour | `globals.css:6` | `--text: black;` |
| Card background | `globals.css:7` | `--card: #fffbe6;` |
| Card hover colour | `globals.css:81` | `.card:hover { background: yellow; }` |
| Image height | `globals.css:82` | `height: 160px;` -> `height: 220px;` |
| Number of grid columns | `globals.css:72` | `repeat(3, 1fr)` -> `repeat(4, 1fr)` |
| Mobile breakpoint | `globals.css:90` | `max-width: 800px` -> `600px` |
| Nav layout direction | `globals.css:45` | add `flex-direction: column;` |
| Footer text | `layout.jsx:32` | change the `<p>` text |
| Add a source in dropdown | `page.jsx:74` | add `<option value="X">X</option>` (X must match `source:` in news.js) |
| Change news API URL (JSON) | `news.js:10` | change `HN_URL` |
| Change RSS feed URL | `news.js:11` | change `TC_URL` |
| Number of Hacker News items | `news.js:10` | `hitsPerPage=30` |
| Port | `package.json:6,8` | add `-p 4000` |
| Database name/table | - | none, no database in this version |
| Add a new field (e.g. author) | `news.js:~37-43` (Hacker News: `author: hit.author`), `news.js:~54-60` (TechCrunch: `author: item["dc:creator"]`), `ArticleCard.jsx:~14` (show `{article.author}`), optionally `sample-news.json` (add `"author"` to items) | 4 places |

## 6. Practical -> where it is shown
| # | Practical | Where |
|---|---|---|
| 1 | HTML headings/lists/images | `<h1>`/`<h2>` in page.jsx, ArticleCard.jsx; `<img>` in ArticleCard.jsx:12; nav links in layout.jsx:22-23. No `<ul>` list, so partial. |
| 2 | Semantic HTML | `header`, `nav`, `main`, `footer` in layout.jsx; `section` in page.jsx; `article` in ArticleCard.jsx |
| 3 | CSS inline/internal/external | External: `globals.css` (imported in layout.jsx:6). Inline and internal: not covered |
| 4 | Flexbox/grid/media queries | flex: globals.css:37, 45, 56, 74; grid: globals.css:72; `@media`: globals.css:90 |
| 5 | CSS position | `position: sticky` on the header, globals.css:35 |
| 6 | Linked JS, events, array functions | events: onClick/onChange (page.jsx:66-76); `filter`, `map`, `some`, `sort` (page.jsx:42-57, news.js:75). Plain linked `<script>` file: not covered |
| 7 | JS form validation | search validation page.jsx:50-52 and message line 80-82 |
| 8 | React SPA + JSX | the whole `frontend/` (Next.js App Router, React) |
| 9 | React props/state/hooks/events/conditional rendering | props: ArticleCard.jsx:7; `useState`/`useEffect`: page.jsx:13-37; conditional rendering: page.jsx:80-87 |
| 10 | fetch + JSON | browser: page.jsx:25-27; server: news.js:16-31 |
| 11 | DOM manipulation + events | React updates the DOM for you; raw DOM code (`createElement`, `getElementById`) not covered |
| 12 | PHP | not covered |
| 13 | PHP-MySQL CRUD | not covered (save/remove in localStorage is similar to create/delete) |
| 14 | Node + Express server | partly: Next.js is the Node server, folders are routes, `public/` is static files. Not Express |
| 15 | REST API + DB | `GET /api/news?q=&source=` in route.js (JSON, query params). No database |

## 7. Likely viva questions
- **What is Next.js?** A React framework: it gives routing by folders, a server, and builds the app. `app/page.jsx` = `/`, `app/saved/page.jsx` = `/saved`.
- **App Router?** Routing in the `src/app` folder. `layout.jsx` wraps pages, `page.jsx` is a page, `route.js` is an API endpoint.
- **Server vs client component?** Server components run only on the server (default; `layout.jsx`). Client components start with `"use client"` and run in the browser; needed for `useState`, `useEffect`, click events and `localStorage` (page.jsx, saved/page.jsx).
- **Route handler?** A function named `GET` in `route.js` that returns a Response; it makes the `/api/news` REST endpoint (route.js:11).
- **What is JSX?** HTML-like syntax inside JavaScript. `{ }` puts JS values in it.
- **Props?** Data passed from parent to child: `<ArticleCard article=... isSaved=... onToggleSave=.../>`.
- **useState / useEffect?** `useState` stores data that changes the screen. `useEffect(..., [])` runs code once after the page first shows (we load news there).
- **Conditional rendering?** `{loading && <p>Loading...</p>}` shows something only when a condition is true.
- **Why `key` in `.map`?** React uses it to tell list items apart.
- **`map` / `filter` / `some`?** `map` turns each item into something new (cards); `filter` keeps matching items (search); `some` asks "does any item match?" (is it saved).
- **fetch and Promises?** `fetch` asks a URL for data and returns a Promise; `await` waits for it. We use `async/await` with try/catch to show an error message.
- **JSON?** Text format for data. `response.json()` or `JSON.parse` -> object; `JSON.stringify` -> text (used for localStorage).
- **RSS vs JSON API?** RSS is an XML file of items that sites publish (TechCrunch), so we parse it with fast-xml-parser. A JSON API (Hacker News Algolia) returns ready JSON that you can search with parameters.
- **Why fetch on the server in news.js, not in the browser?** Browsers block calls to other sites (CORS) and the server can combine both sources and hide fallback logic.
- **localStorage?** Small key/value storage in the browser; only strings, so we use `JSON.stringify`/`JSON.parse`. It stays after closing the tab but is per browser, not shared between devices.
- **Why is localStorage read inside `useEffect`?** It does not exist on the server, only in the browser.
- **Why `Promise.allSettled`?** Runs both fetches together; if one fails the other still works.
- **Status codes?** 200 OK (our API), 404 not found, 500 server error. We return 200 with a JSON list.
- **CSS variables?** Defined in `:root` (`--main`), used with `var(--main)`; change one line to restyle everything.
- **Flexbox vs grid?** Flexbox = one row or column (header, controls); grid = rows and columns (card grid).
- **Media query?** CSS that applies only on certain screen sizes: below 800px the grid becomes 1 column.
- **`position: sticky`?** Element scrolls normally until it reaches `top: 0`, then sticks (the header).
- **Semantic HTML?** Tags that describe meaning (`header`, `nav`, `main`, `article`, `footer`) which helps accessibility and SEO.
- **`textContent` vs `innerHTML`?** We never use `innerHTML`; React escapes text automatically, which prevents XSS. `toExcerpt` also strips HTML tags from feed text.

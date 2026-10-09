# News sources

Endpoint checks on 2026-10-09 returned HTTP 200 and a parseable feed/JSON response for all five sources:

| Source | Endpoint | Use |
|---|---|---|
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/feed/ | Publisher RSS title, link, date and excerpt |
| arXiv cs.AI | https://rss.arxiv.org/rss/cs.AI | Research RSS metadata |
| arXiv cs.LG | https://rss.arxiv.org/rss/cs.LG | Machine-learning RSS metadata |
| Hacker News Algolia | https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=50 | Recent stories after AI relevance filtering |
| Hugging Face Daily Papers | https://huggingface.co/api/daily_papers?limit=30 | Recent paper metadata and abstract |

The parser validates response shape, uses 12-second timeouts and continues if an individual source fails. A source may change or rate-limit its endpoint. Excerpts are capped at 500 characters; full articles are never ingested. Publisher images are not hotlinked. ArXiv/Hugging Face overlap is deduplicated by canonical arXiv URL. Source terms and polling limits should be reviewed before high-volume production use. The Verge and MIT feeds in the old seed file have not been validated for this implementation and are not polled.

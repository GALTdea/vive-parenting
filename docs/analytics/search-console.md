# Google Search Console

Search Console measures **search visibility** (impressions, clicks, queries, indexing). It does not replace on-site analytics (GA4) or hosting analytics (Cloudflare).

## Known configuration (from task context + repo)

| Item | Detail |
|------|--------|
| Property type | Domain property `vibeparenting.org` (operational assumption) |
| Ownership | DNS verification (operational assumption; not stored in repo) |
| Canonical site | `https://vibeparenting.org` (`astro.config.mjs`) |
| Sitemap index | `https://vibeparenting.org/sitemap-index.xml` |
| Robots | `https://vibeparenting.org/robots.txt` |

Sitemap submission status, indexing coverage, and manual URL inspection history **require manual verification in external dashboard** (Google Search Console).

## Sitemap generation

- Integration: `@astrojs/sitemap` in `astro.config.mjs`
- Build output: Astro sitemap integration emits sitemap index and child sitemaps under `dist/` at deploy time
- `site` option ensures absolute URLs use `https://vibeparenting.org`

## robots.txt

From `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://vibeparenting.org/sitemap-index.xml
```

Copied to site root on deploy.

## Published vs draft projects

Project visibility for **built routes**:

```typescript
// src/lib/projects.ts — isProjectVisible()
// DEV: all editorial statuses
// PROD: only editorialStatus === 'published'
```

`getStaticPaths` in `src/pages/projects/[slug].astro` uses `isProjectVisible`. Draft project URLs are **not** generated in production builds, so they should not appear in the production sitemap.

In local dev, draft projects may be reachable for preview; do not request indexing for non-production URLs.

## How new projects become discoverable

1. Add content under `src/content/projects/` with schema-valid frontmatter.
2. Set `editorialStatus: published` for production inclusion.
3. Deploy to production (Cloudflare Pages).
4. Build regenerates sitemap including new `/projects/{slug}/` URLs.
5. Google discovers via sitemap crawl and internal links (homepage, `/projects/` directory).
6. Optional: URL Inspection → **Request indexing** in Search Console (no guarantee).

Submitting a sitemap or requesting indexing **does not guarantee** Google will index every URL or how quickly.

## Recommended Search Console workflows

| Task | Where |
|------|--------|
| Confirm sitemap fetched | Sitemaps report |
| Diagnose crawl issues | Pages → Indexing |
| Inspect live URL | URL Inspection tool |
| Query performance | Performance report (queries, pages, countries) |
| Regressions after deploy | Compare impressions/clicks week over week |

## Relationship to GA4

| Signal | Search Console | GA4 |
|--------|----------------|-----|
| Organic search clicks from Google | Yes (search results) | Yes (session source/medium) |
| On-site try clicks | No | Yes (`project_try_click`) |
| Impressions for queries | Yes | No (not query-level in standard GA4) |

Linking GA4 and Search Console in GA4 Admin enables some combined reports; link status **requires manual verification in external dashboard**.

## Related

- [objectives.md](./objectives.md)
- [reporting-and-kpis.md](./reporting-and-kpis.md)
- [roadmap.md](./roadmap.md)

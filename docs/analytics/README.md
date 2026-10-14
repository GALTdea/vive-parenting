# Analytics documentation

Authoritative reference for analytics and engagement tracking on [Vibe Parenting](https://vibeparenting.org). Read this first before changing tracking, consent, or reporting-related code.

## Purpose

Measure whether the project directory is useful to families and creators: discovery, project exploration, outbound “Try Project” clicks, submission intent, and (separately) hosting-level traffic and search visibility.

## Systems in use

| System | Role | Consent-gated? |
|--------|------|----------------|
| [Google Analytics 4](./google-analytics.md) | Optional client-side usage and custom engagement events | Yes — loads only after accept |
| [Cloudflare Web Analytics](./cloudflare-analytics.md) | Hosting-level web analytics on production | No — not controlled by site consent UI |
| [Google Search Console](./search-console.md) | Organic search performance and indexing | N/A (Google-side) |

## Current implementation status (verified in repo)

- Consent banner and Privacy Settings dialog with localStorage persistence
- GA4 (`G-YGH3N5GGPF`) loaded dynamically in **production builds only** after consent
- Automatic GA4 `page_view` via `gtag('config', …, { send_page_view: true })`
- Three custom GA4 engagement events (Try Project, creator link, submit clicks)
- Delegated click tracking via `data-ga-event` attributes
- `@astrojs/sitemap` + `public/robots.txt` for SEO discovery
- Privacy policy copy aligned with analytics behavior

Not implemented in application code: newsletter signup tracking, GA4 key events / custom dimensions registration, automated reporting, Search Console API integration.

## Important source files

| File | Responsibility |
|------|----------------|
| `src/lib/consent.ts` | Measurement ID, localStorage key, consent constants |
| `src/scripts/analytics-consent.ts` | Consent UI wiring, GA load/teardown, gtag stub |
| `src/components/AnalyticsConsent.astro` | Banner + Privacy Settings markup |
| `src/lib/analytics-events.ts` | Event name constants, `trackAnalyticsEvent()` |
| `src/scripts/init-analytics-events.ts` | Document-level click delegation |
| `src/layouts/Layout.astro` | Includes consent UI + engagement script on all pages |
| `astro.config.mjs` | `site: https://vibeparenting.org`, sitemap integration |
| `public/robots.txt` | Sitemap URL |

## Documentation index

| Document | Contents |
|----------|----------|
| [objectives.md](./objectives.md) | Business goals analytics supports |
| [architecture.md](./architecture.md) | Data flow, integration points, Mermaid diagram |
| [events.md](./events.md) | Every tracked event, parameters, triggers |
| [privacy-and-consent.md](./privacy-and-consent.md) | Banner, storage, GA gating, Cloudflare distinction |
| [google-analytics.md](./google-analytics.md) | GA4 setup, config flags, known gtag bug fix |
| [cloudflare-analytics.md](./cloudflare-analytics.md) | Web Analytics vs zone stats |
| [search-console.md](./search-console.md) | Sitemap, robots, indexing workflow |
| [testing-and-debugging.md](./testing-and-debugging.md) | DevTools, Realtime, troubleshooting |
| [reporting-and-kpis.md](./reporting-and-kpis.md) | KPIs, CTR, UTM conventions |
| [roadmap.md](./roadmap.md) | Completed vs planned analytics work |

## Quick verification (production-like)

1. `npm run build && npm run preview`
2. Open preview, **decline** — no `googletagmanager.com/gtag/js` in Network.
3. **Accept** — gtag script loads; filter Network for `g/collect` and `en=page_view`.
4. On a project page, click **Try Project** — `en=project_try_click` with `project_slug`, `project_name`.

Full steps: [testing-and-debugging.md](./testing-and-debugging.md).

## Adding new analytics events

1. Add a constant in `src/lib/analytics-events.ts` (snake_case event name).
2. Set `data-ga-event` on the element (and `data-ga-project-slug` / `data-ga-project-name` when relevant).
3. Do **not** call `gtag` directly from components — use `trackAnalyticsEvent()` via the delegation layer or extend delegation intentionally.
4. Do **not** duplicate automatic GA4 events (e.g. avoid manual `page_view` while `send_page_view: true`).
5. Update [events.md](./events.md) and [roadmap.md](./roadmap.md) if scope changes.

## Known limitations

- GA4 does not load in `astro dev` (`analyticsEnabled: import.meta.env.PROD`).
- Consent is per-browser localStorage only; no cross-device sync.
- Cloudflare Web Analytics is independent of GA consent (see [privacy-and-consent.md](./privacy-and-consent.md)).
- Ad blockers and browser privacy features may block GA4 entirely.
- GA4 dashboard settings (key events, custom dimensions, Enhanced Measurement toggles) require manual verification in GA4 Admin.
- `project_submit_click` measures click intent, not completed email sends.

## Recommended next steps

1. Register `project_slug` and `project_name` as custom dimensions in GA4 (if not already done).
2. Mark `project_try_click` as a key event in GA4 for funnel reporting.
3. Confirm Cloudflare Web Analytics is enabled for `vibeparenting.org` in the Cloudflare dashboard.
4. Establish a weekly review using [reporting-and-kpis.md](./reporting-and-kpis.md).

Before modifying analytics functionality, review this documentation and **update it when behavior changes**.

# Cloudflare Web Analytics

Cloudflare provides two conceptually different analytics layers. Only Web Analytics is aligned with “website visits” comparable to GA4 page views.

## Zone traffic analytics vs Web Analytics

| | Cloudflare zone / HTTP analytics | Cloudflare Web Analytics |
|--|----------------------------------|---------------------------|
| **What it measures** | HTTP requests at the edge: pages, assets, bots, crawlers, cached hits | Browser-oriented visits and page views on the site |
| **Typical use** | Capacity, cache, security, bot traffic | Marketing-friendly traffic trends |
| **In repo** | Not configured in code | Not configured in code; enabled per privacy copy in **Cloudflare dashboard** |
| **Consent** | N/A (server/edge) | **Not** gated by site GA consent UI |

**Do not** treat zone **request counts** as equal to **human visitors**. Bots, prefetch, asset requests, and crawlers inflate zone metrics.

## Verified site configuration (from repository)

| Item | Source |
|------|--------|
| Production domain | `https://vibeparenting.org` (`astro.config.mjs` → `site`) |
| Deployment platform | Described as Cloudflare Pages in `src/pages/privacy/index.astro` |
| Application beacon code | **None** — no Cloudflare analytics script in `src/` |
| User disclosure | Privacy policy + `AnalyticsConsent.astro` + Privacy Settings dialog |

How Web Analytics is enabled (automatic injection vs manual snippet), exact beacon URL, and sampling settings **require manual verification in external dashboard** (Cloudflare → Analytics & Logs → Web Analytics).

## Relationship to Google Analytics

- GA4: optional, consent-gated, rich event model, under-reports when declined or blocked.
- Cloudflare Web Analytics: always on production per hosting configuration, aggregate privacy-oriented metrics, independent of `vibeparenting-analytics-consent`.

Operators comparing GA4 vs Cloudflare should expect systematic differences (consent, ad blockers, bot handling, definitions of “visit”).

## Canonical domain and redirects

Canonical site URL in Astro is `https://vibeparenting.org` (no `www` in config).

Redirect rules (e.g. `www` → apex, HTTP → HTTPS) are typically configured in Cloudflare DNS/Page Rules/Redirect Rules and **require manual verification in external dashboard**. The repo does not contain `_redirects` or `wrangler.toml`.

## Verifying Web Analytics

1. Log in to Cloudflare dashboard for the zone hosting `vibeparenting.org`.
2. Open **Web Analytics** (not only zone Overview traffic).
3. Compare visit trends with GA4 (understanding consent bias on GA4).

Cannot be fully verified from git alone.

## Privacy considerations

- Documented to visitors as separate from optional GA4 ([privacy-and-consent.md](./privacy-and-consent.md)).
- Cloudflare’s own privacy policy applies to their processing.
- No child-specific fields are sent from application code; Cloudflare still sees technical request/beacon data.

## Limitations

- No project-level or try-click granularity in application integration (unlike GA4 custom events).
- Not controlled by Privacy Settings buttons today.
- Dashboard retention and filtering options depend on Cloudflare product tier/settings.

## Related

- [architecture.md](./architecture.md)
- [reporting-and-kpis.md](./reporting-and-kpis.md)

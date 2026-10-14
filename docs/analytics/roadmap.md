# Analytics roadmap

Status labels reflect **repository verification** as of documentation date. GA4 Admin and Cloudflare dashboard items need external confirmation.

## Completed

| Item | Evidence |
|------|----------|
| Privacy policy describing analytics | `src/pages/privacy/index.astro`, commit `6673cae` |
| Consent banner + Privacy Settings | `AnalyticsConsent.astro`, `analytics-consent.ts` |
| localStorage consent (`vibeparenting-analytics-consent`) | `src/lib/consent.ts` |
| Consent-gated GA4 load (production only) | `import.meta.env.PROD` in `AnalyticsConsent.astro` |
| GA4 measurement ID `G-YGH3N5GGPF` | `src/lib/consent.ts` |
| Fix gtag/dataLayer queue (page views working) | Commit `4cc69b1` |
| Automatic page views (`send_page_view: true`) | `analytics-consent.ts` |
| Custom events: try, creator, submit clicks | Commit `3ba97a0`, `analytics-events.ts` |
| Delegated `data-ga-event` tracking | `init-analytics-events.ts` |
| Sitemap + robots.txt | `astro.config.mjs`, `public/robots.txt`, commit `a496424` |
| Published-only project routes in production | `isProjectVisible()` in `src/lib/projects.ts` |

## Partially implemented

| Item | Done | Remaining |
|------|------|-----------|
| GA4 custom dimensions for `project_slug`, `project_name` | Params sent in events | Register in GA4 Admin; add to reports |
| GA4 key events (conversions) | Events fire | Mark e.g. `project_try_click` as key event in Admin |
| Enhanced Measurement | May be on by default in GA4 | Confirm toggles; reconcile with custom outbound events |
| Search Console coverage | Sitemap/robots in repo | Ongoing indexing, performance monitoring in GSC UI |
| Cloudflare Web Analytics | Disclosed in UI/policy | Confirm beacon + review dashboards externally |
| Submission funnel | `project_submit_click` for CTAs | No tracking of mailto send completion (impossible client-side) |
| Campaign measurement | UTMs supported by GA4 | No internal campaign registry or lint for links |

## Planned

Recommended near-term work (not yet in codebase):

- Mark `project_try_click` as GA4 key event
- Register custom dimensions for project parameters
- Saved GA4 Explorations: project leaderboard (views vs try clicks)
- Weekly analytics review template (see [reporting-and-kpis.md](./reporting-and-kpis.md))
- Document active UTM campaigns alongside launches

## Optional future improvements

- **Category / metadata dimensions:** Pass `project_category` as event parameter from content collection
- **Newsletter signup event** when signup exists (privacy policy notes none today)
- **Engagement by browse category** (Mathematics, STEM, etc.)
- **Traffic source quality:** Compare try-click rate by source/medium
- **Automated weekly email/Slack report** (GA4 API, Search Console API)
- **Search Console ↔ GA4 linked reports** (Admin link)
- **Creator participation metrics** (submissions received vs click intent)
- **Simple internal dashboard** (Looker Studio or Cloudflare + GA4)
- **Consent analytics** (accept rate — implement carefully, privacy-first)
- **Align Cloudflare Web Analytics with consent** if product/policy requires (hosting change)
- **Server-side or privacy-preserving analytics** alternative/supplement

## Out of scope for analytics code (product)

- Monetization experiments
- User accounts and authenticated analytics
- In-site project submission forms with server-side tracking

When implementing roadmap items, update [events.md](./events.md), [README.md](./README.md), and this file.

# Reporting and KPIs

Initial measurement strategy for Vibe Parenting. Aligns with [objectives.md](./objectives.md).

## Primary questions

1. Are people discovering Vibe Parenting?
2. Are visitors interested in projects (detail page views)?
3. Which projects attract attention?
4. Are visitors clicking through to try projects?
5. Which marketing channels bring engaged visitors?
6. Are creators interested in submitting projects?

## KPI definitions

| KPI | Definition | Primary source |
|-----|------------|----------------|
| Visitors | Distinct users (GA4 definition) | GA4 |
| Sessions | Periods of engagement | GA4 |
| Traffic sources | Default channel / source-medium | GA4 Acquisition |
| Engagement rate | Engaged sessions / sessions (GA4 metric) | GA4 |
| Project page views | Views where `page_path` matches `/projects/{slug}/` | GA4 Pages and screens |
| Try Project clicks | Count of event `project_try_click` | GA4 Events |
| Project CTR | Try Project clicks ÷ project detail page views | GA4 Explore (calculated) |
| Project submission clicks | Count of `project_submit_click` | GA4 Events |
| Organic search impressions | Times URLs appeared in search results | Search Console |
| Organic search clicks | Clicks from Google Search to site | Search Console |
| Hosting visits (aggregate) | Cloudflare Web Analytics visits | Cloudflare dashboard |

Cloudflare zone **request** counts are **not** listed as a visitor KPI (see [cloudflare-analytics.md](./cloudflare-analytics.md)).

## Project click-through rate (CTR)

**Formula:**

```
Project CTR (period) =
  count(project_try_click events on /projects/{slug}/)
  ÷
  count(page_view or screen views for /projects/{slug}/)
```

Use the same date range and filter to one slug. Build in **GA4 Explore** with event + page path filters.

### Limitations

- **Repeated try clicks** from same user inflate numerator.
- **Page views** count revisits; CTR is not unique users.
- **Sessions vs users:** CTR by session requires session-scoped Explore techniques.
- **Consent bias:** Declined GA = missing from GA4 only.
- **Watch Demo** and resource links are not try clicks unless separately tracked.
- Numerator is outbound **click intent**, not confirmed use of external product.

## Weekly review process (recommended)

1. **GA4 Realtime / last 7 days:** Sessions, top pages, top events (`project_try_click`, `project_submit_click`).
2. **Project pages:** Rank `/projects/*` by views; note top try-click events (Explore with `project_slug` if registered as dimension).
3. **Acquisition:** Source/medium; note any UTM campaigns.
4. **Search Console:** Impressions, clicks, top queries and pages (7-day compare).
5. **Cloudflare Web Analytics:** Sanity-check total visit trend vs GA4 (expect GA4 ≤ Cloudflare when consent/blockers matter).
6. **Actions:** Promote high-CTR projects, improve low-CTR pages, adjust campaigns.

## Marketing campaigns and UTM parameters

GA4 reads standard UTM query parameters on the landing page when the tag is active:

| Parameter | Role | Example |
|-----------|------|---------|
| `utm_source` | Origin | `x`, `newsletter`, `facebook` |
| `utm_medium` | Channel type | `social`, `email`, `cpc` |
| `utm_campaign` | Campaign name | `site_launch`, `spring_2026` |
| `utm_content` | Optional creative variant | `hero_cta` |
| `utm_term` | Optional paid keyword | _(paid search)_ |

**Example landing URL:**

```
https://vibeparenting.org/?utm_source=x&utm_medium=social&utm_campaign=site_launch
```

### UTM naming conventions

- Lowercase, underscores: `site_launch`, not `Site Launch`.
- Stable `utm_source` per platform (`x`, `instagram`, `newsletter`).
- One `utm_campaign` per initiative; reuse across channels with different `utm_medium`.
- Document active campaigns in team notes or [roadmap.md](./roadmap.md).

No application code validates UTMs; typos create fragmented GA4 reports.

## Which system for which metric

| Question | GA4 | Search Console | Cloudflare Web |
|----------|-----|----------------|----------------|
| Try Project clicks | Yes | No | No |
| Project page views (consented) | Yes | No | Partial (URL-level aggregate) |
| Search queries | No | Yes | No |
| Full funnel with custom params | Yes | No | No |
| Traffic without GA consent | No | N/A | Yes (beacon) |

## Related

- [events.md](./events.md)
- [search-console.md](./search-console.md)
- [roadmap.md](./roadmap.md)

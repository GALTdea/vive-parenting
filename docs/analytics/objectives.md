# Business objectives

## What Vibe Parenting is

Vibe Parenting ([vibeparenting.org](https://vibeparenting.org)) is a community-driven directory of projects built by parents, educators, and independent makers. Listed work includes educational tools for children, AI-assisted learning projects, interactive experiences, neurodiversity and special-needs parenting tools, and other useful community-created projects.

## Audiences

1. **Discoverers** — parents, educators, and families looking for useful projects.
2. **Creators** — people who want to share what they built with the community.

Near-term success is **not** tied to immediate monetization. The focus is learning whether the product delivers value and can grow an audience.

## Questions analytics should answer

### Discovery and usefulness

- Do visitors find the directory useful enough to browse?
- Do they open individual project detail pages?
- Which projects and categories attract attention?

### Engagement and outcomes

- Do visitors click through to **Try Project** (external project URLs)?
- Which projects have the strongest try-click interest relative to page views?
- Do visitors explore creator profiles from project pages?

### Growth and marketing

- Which channels and campaigns bring traffic?
- Is campaign traffic engaged (project views, try clicks) or bounce-heavy?

### Community participation

- Are creators interested in submitting projects (clicks on submit CTAs)?
- Over time: organic search impressions/clicks (Search Console) vs on-site behavior (GA4).

## Longer-term objectives

Analytics also supports future goals when they exist:

- Audience growth and repeat visits
- Organic search visibility
- Community participation and submissions
- Newsletter or mailing-list growth (not implemented on site today)
- Potential monetization (sponsorship, partnerships) informed by traffic and engagement quality

## How each system supports these goals

| Objective | Primary signals |
|-----------|-----------------|
| Directory usefulness | GA4 sessions, engagement rate, pages per session, `/projects/` and home traffic |
| Project interest | GA4 page paths under `/projects/{slug}/`, Cloudflare page views (aggregate) |
| Try / outbound intent | GA4 `project_try_click`; optionally GA4 Enhanced Measurement outbound clicks |
| Category interest | Break down project page views and try clicks by path or future custom dimensions |
| Campaign quality | GA4 traffic acquisition + UTM parameters |
| Submission interest | GA4 `project_submit_click` |
| Search discovery | Search Console impressions, clicks, queries, indexed URLs |
| Hosting health | Cloudflare zone vs Web Analytics (see [cloudflare-analytics.md](./cloudflare-analytics.md)) |

Privacy choices reduce GA4 coverage (declined consent = no GA4 client data for that browser). Cloudflare Web Analytics and Search Console still provide partial, non-consented or Google-side views—interpret them with that bias in mind. See [privacy-and-consent.md](./privacy-and-consent.md).

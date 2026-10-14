# Analytics events

All event names and triggers below are verified from the repository. GA4 automatic and Enhanced Measurement events are described at a high level; exact Enhanced Measurement toggles **require manual verification in external dashboard** (GA4 Admin → Data streams → Enhanced measurement).

## Event categories

1. **Automatically collected GA4 events** — sent by GA4 when the tag is loaded and configured (e.g. `page_view`, `session_start`, `first_visit`). No application code fires these by name except via `gtag('config', …, { send_page_view: true })`.
2. **GA4 Enhanced Measurement events** — optional events such as `click` (outbound), `file_download`, `scroll`, etc., if enabled in the GA4 property. May overlap semantically with outbound links; custom events use distinct names.
3. **Custom application events** — fired only through `trackAnalyticsEvent()` after consent.

## Naming conventions (for new events)

- Use **snake_case** event names (GA4 recommendation).
- Define constants in `src/lib/analytics-events.ts` (prefix `GA_EVENT_`).
- Attach tracking via **`data-ga-event`** on clickable elements; avoid duplicate manual `gtag('event', 'page_view', …)` while `send_page_view: true`.
- Project-scoped parameters: **`project_slug`**, **`project_name`** (strings, no PII).
- Do not send names, emails, form contents, or child-related PII.

## Automatic page views

| Event name | Business purpose | Trigger | Parameters | Source | Consent | GA4 behavior | Verification |
|------------|------------------|---------|------------|--------|---------|--------------|--------------|
| `page_view` | Measure which pages visitors see | First load after `gtag('config', …)` with `send_page_view: true` | Standard GA4 page fields (`page_location`, `page_path`, etc.) | `src/scripts/analytics-consent.ts` → `loadGoogleAnalytics()` | Required | Standard page_view hit | Network: `g/collect` with `en=page_view` after accept |

Project detail URLs: `/projects/{slug}/` (e.g. `/projects/space-math-academy/`). Compare projects in GA4 **Engagement → Pages and screens** or Explore on `page_path`.

No extra custom `page_view` events are implemented in application code.

## Custom application events

### `project_try_click`

| Field | Value |
|-------|--------|
| **Business purpose** | Measure intent to use an external project (primary conversion proxy) |
| **Trigger** | Primary click on hero **Try Project** on a project detail page (left button only; not Watch Demo) |
| **Parameters** | `project_slug`, `project_name` |
| **Source** | `src/components/project/ProjectHero.astro` → `ExternalLink` with `data-ga-event`, slug, name |
| **Consent** | Required |
| **GA4 behavior** | Custom event via `gtag('event', 'project_try_click', params)` |
| **Verification** | Click Try Project → `en=project_try_click` and query params for custom dimensions |

### `creator_link_click`

| Field | Value |
|-------|--------|
| **Business purpose** | Measure interest in creators behind projects |
| **Trigger** | Click **About the creator** profile link on project detail (not Sources & resources links) |
| **Parameters** | `project_slug`, `project_name` |
| **Source** | `src/components/projects/ProjectDetail.astro` |
| **Consent** | Required |
| **GA4 behavior** | Custom event |
| **Verification** | Project with creator block → click profile link → `en=creator_link_click` |

### `project_submit_click`

| Field | Value |
|-------|--------|
| **Business purpose** | Measure submission **intent** (starts submit flow, not completed email) |
| **Trigger** | Clicks on: header **Submit a Project** (`SiteHeader.astro`), homepage hero **Submit a Project** (`index.astro`), `/submit/` **Submit Your Project** mailto when configured (`submit/index.astro`) |
| **Parameters** | None |
| **Source** | Files above; delegation in `src/scripts/init-analytics-events.ts` |
| **Consent** | Required |
| **GA4 behavior** | Custom event without extra params |
| **Verification** | Click each CTA → `en=project_submit_click` |

## Implementation mechanics

```typescript
// src/lib/analytics-events.ts — consent gate + gtag call
export function trackAnalyticsEvent(eventName: string, params?: Record<string, string>): void {
  if (!hasAnalyticsConsentForEvents()) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
```

Delegation (`src/scripts/init-analytics-events.ts`):

- Ignores non-primary-button clicks (middle/right, modified clicks).
- Reads `data-ga-event`, optional `data-ga-project-slug`, `data-ga-project-name`.

`ExternalLink.astro` forwards `data-ga-*` props to `<a target="_blank" rel="noopener noreferrer">`.

## GA4 automatic / Enhanced Measurement (not custom-coded)

When GA4 is active, Google may also collect events such as:

- `session_start`, `user_engagement`, `first_visit` (automatic)
- Outbound link clicks, scrolls, site search, etc. (Enhanced Measurement — **requires manual verification in external dashboard**)

Custom outbound engagement for Try Project is intentionally named `project_try_click` with project parameters so reports can distinguish directory CTAs from generic outbound clicks.

## Avoiding duplicate tracking

- Do not add a second listener on the same control without removing `data-ga-event`.
- Do not fire `page_view` manually while `send_page_view: true`.
- Prefer one delegated listener (`initAnalyticsEngagementTracking`) over per-component `onclick` handlers.

## Legacy doc

Previous standalone doc: [../analytics-events.md](../analytics-events.md) (redirects here).

## Related

- [testing-and-debugging.md](./testing-and-debugging.md)
- [google-analytics.md](./google-analytics.md)
- [reporting-and-kpis.md](./reporting-and-kpis.md)

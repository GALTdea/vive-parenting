# Google Analytics 4

## Property purpose

Optional measurement of how visitors use Vibe Parenting: page views, engagement, custom project events, and campaign attribution via standard GA4 reports.

## Verified application configuration

| Setting | Value |
|---------|--------|
| Measurement ID | `G-YGH3N5GGPF` (`src/lib/consent.ts` → `GA_MEASUREMENT_ID`) |
| Also documented in | Privacy policy page |
| Install method | Dynamic script injection after consent (`src/scripts/analytics-consent.ts`) |
| Disable flag | `window['ga-disable-G-YGH3N5GGPF']` |
| Page views | `gtag('config', id, { send_page_view: true })` |
| Google signals | `allow_google_signals: false` |
| Ad personalization signals | `allow_ad_personalization_signals: false` |
| Environment | Loads only when `import.meta.env.PROD` and consent is `accepted` |

Web data stream name, enhanced measurement toggles, data retention, key events, and custom dimension registrations **require manual verification in external dashboard** (GA4 Admin).

## Script installation sequence

1. `installGtagStub()` — standard Google queue:

```javascript
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};
```

2. `gtag('js', new Date())`
3. `gtag('config', 'G-YGH3N5GGPF', { send_page_view: true, … })`
4. Append async script: `https://www.googletagmanager.com/gtag/js?id=G-YGH3N5GGPF`

Custom events use `gtag('event', eventName, params)` from `trackAnalyticsEvent()`.

## Consent gating

GA4 never loads on first paint. See [privacy-and-consent.md](./privacy-and-consent.md).

## Custom events and parameters

| Event | Parameters |
|-------|------------|
| `project_try_click` | `project_slug`, `project_name` |
| `creator_link_click` | `project_slug`, `project_name` |
| `project_submit_click` | _(none)_ |

To appear as breakdown dimensions in standard GA4 reports, register event parameters as **custom dimensions** in GA4 Admin → Custom definitions. **Requires manual verification in external dashboard.**

## Key events

Marking events (e.g. `project_try_click`) as **key events** for conversion reporting is recommended but **not configured in application code**. **Requires manual verification in external dashboard.**

## Reporting surfaces (GA4 UI)

| Need | Typical GA4 location |
|------|----------------------|
| Live testing | Reports → Realtime |
| Page popularity | Engagement → Pages and screens |
| Event counts | Engagement → Events |
| Campaigns | Acquisition → Traffic acquisition (UTM) |
| Deep dives | Explore (free form) |
| Event parameter setup | Admin → Events / Custom definitions |

Standard reports may lag 24–48 hours; Realtime is fastest for verification.

## Incident: tag loaded but no measurement hits

**Symptoms:** `googletagmanager.com/gtag/js` loaded successfully, but browser Network showed **no** requests to `/g/collect` (no `page_view`).

**Root cause (fixed in commit `4cc69b1`):** Non-standard `dataLayer` queue. The previous stub pushed a **JavaScript array** of arguments:

```javascript
// Incorrect — gtag.js does not process this queue format correctly
window.gtag = function gtag(...args) {
  window.dataLayer?.push(args);
};
```

Google’s gtag expects each queue entry to be the **`arguments` object** from the gtag call:

```javascript
// Correct — matches Google’s documented stub
window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};
```

**Additional fixes in the same change:**

- Call `gtag('config', …)` **before** script onload (not only inside `script.onload`), with `send_page_view: true`.
- Avoid skipping re-init when script already exists vs stale state.

**Prevention checklist for future changes:**

- Do not replace `push(arguments)` with spread/rest array pushes unless Google’s documentation changes.
- After any gtag refactor, verify `/g/collect` with `en=page_view` in Network tab.
- Compare against [Google gtag.js install snippet](https://developers.google.com/tag-platform/gtagjs/install).

## Enhanced Measurement

If enabled in GA4 Admin, GA4 may auto-collect scrolls, outbound clicks, etc. Application custom events remain the source of truth for project slug/name attribution. **Requires manual verification in external dashboard.**

## Campaign attribution

GA4 reads standard UTM query parameters on page load when GA is active. No custom UTM parsing in repo. See [reporting-and-kpis.md](./reporting-and-kpis.md).

## Verifying GA4 receives data

1. Production build: `npm run build && npm run preview`
2. Accept analytics
3. DevTools → Network → filter `collect` or `g/collect`
4. Confirm `en=page_view` and custom `en=` values
5. Optional: GA4 Realtime and DebugView (**debug_mode not enabled in production builds by default**)

Full guide: [testing-and-debugging.md](./testing-and-debugging.md).

## Related code

- `src/lib/consent.ts`
- `src/scripts/analytics-consent.ts`
- `src/lib/analytics-events.ts`
- [events.md](./events.md)

# Testing and debugging

Practical verification for analytics on Vibe Parenting. GA4 tests require a **production build** because `analyticsEnabled: import.meta.env.PROD`.

## Environment setup

```bash
npm run build
npm run preview
```

Open the URL shown (typically `http://localhost:4321`). Local dev (`npm run dev`) exercises consent UI but **does not load GA4** even after accept.

## 1. Verify Google Analytics script loading

1. Open site with **no** stored consent (clear `localStorage` key `vibeparenting-analytics-consent` or use private window).
2. DevTools → **Network** → filter `gtag` or `googletagmanager`.
3. **Expected:** No `gtag/js` request until you click **Accept Analytics**.
4. After accept, **Expected:** Request to `https://www.googletagmanager.com/gtag/js?id=G-YGH3N5GGPF`.

## 2. Check browser network requests (/g/collect)

1. After accept, filter Network for `collect` or `g/collect`.
2. **Expected:** Hits to `https://www.google-analytics.com/g/collect` (or regional equivalent).

**Failure mode:** Script loads but **no** `/g/collect` — often broken `dataLayer` stub. Correct implementation uses `dataLayer.push(arguments)`, not `push([...args])`. See [google-analytics.md](./google-analytics.md).

## 3. Confirm page_view

1. Navigate to any page (e.g. `/projects/space-math-academy/`).
2. Inspect collect request query string or payload for event name `page_view` (`en=page_view`).

Only one automatic page_view per navigation is expected (`send_page_view: true`); no duplicate custom page_view in code.

## 4. Confirm custom event parameters

On a project page:

1. Click **Try Project**.
2. Find collect hit with `en=project_try_click`.
3. Confirm custom params `project_slug`, `project_name` (may appear as ep.* parameters depending on GA4 mapping).

Repeat for **creator link** (`creator_link_click`) and **Submit** CTAs (`project_submit_click`).

## 5. Test analytics consent

| Step | Expected |
|------|----------|
| First visit | Banner visible |
| Accept | Banner hidden; gtag loads; collects fire |
| Reload | Banner stays hidden; GA loads automatically if consent persisted |

Check Application → Local Storage → `vibeparenting-analytics-consent` = `accepted`.

## 6. Test consent withdrawal

1. Footer → **Privacy Settings** → **Decline**.
2. **Expected:** Status text updates; no new `/g/collect` on subsequent clicks.
3. `gtag` script nodes removed; `window.gtag` is no-op.
4. GA cookies cleared where possible.

## 7. GA4 Realtime

In GA4 → **Reports → Realtime**, accept analytics on preview/production and browse. Event names should appear within seconds for active sessions.

## 8. Campaign attribution (UTM)

Visit with query string, e.g.:

`/?utm_source=x&utm_medium=social&utm_campaign=site_launch`

After accept, check Realtime or Traffic acquisition for session source/medium/campaign. UTMs must be present on **landing URL** when GA loads.

## 9. Cloudflare Web Analytics

Cannot be validated fully from localhost preview unless the preview hostname is behind Cloudflare with Web Analytics enabled. Verify in **Cloudflare dashboard → Web Analytics** for production domain traffic.

## 10. DebugView (optional)

GA4 Admin → enable DebugView. Temporarily add `debug_mode: true` to gtag config **only in local experiments** (not in production commits unless intentional). **Requires manual verification in external dashboard.**

## Browser DevTools tips

- **Network:** Preserve log; disable cache while testing consent transitions.
- **Application:** Inspect localStorage and cookies (`_ga`, `_gid`).
- **Console:** `window.vibeParentingAnalytics?.hasAnalyticsConsent()` should reflect storage.

## Common failure modes

| Symptom | Likely cause |
|---------|----------------|
| No GA at all on preview | Forgot `npm run build` / still on `astro dev` |
| Script loads, no collects | Wrong dataLayer queue format (historical bug) |
| No custom events | Declined consent, ad blocker, or missing `data-ga-event` |
| Duplicate page_view | Manual event added while `send_page_view: true` |
| Wrong property | Mismatch measurement ID vs GA4 stream |
| Events in Realtime but not standard reports | Normal delay 24–48h; check Admin → Events |
| Submit click missing on `/submit/` | `SUBMISSION_EMAIL` not set — mailto button not rendered |

## Ad blockers and privacy browsers

Brave, Firefox strict mode, uBlock, etc. may block `googletagmanager.com` or `google-analytics.com`. Test in a clean profile or disable extensions to distinguish code bugs from client blocking.

## Troubleshooting checklist

- [ ] Using `npm run build && npm run preview` (not dev-only)?
- [ ] Consent accepted and localStorage `accepted`?
- [ ] `gtag/js` request succeeds (200)?
- [ ] `/g/collect` present with `en=page_view`?
- [ ] Custom clicks show correct `en=`?
- [ ] Decline stops new collects?
- [ ] Measurement ID `G-YGH3N5GGPF` matches GA4 stream?
- [ ] Compared Cloudflare vs GA4 with consent/ad-block bias in mind?

## Related

- [events.md](./events.md)
- [google-analytics.md](./google-analytics.md)
- [privacy-and-consent.md](./privacy-and-consent.md)

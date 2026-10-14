# Privacy and consent

This documents **application behavior** verified in the repository. It does **not** assert legal compliance (GDPR, COPPA, ePrivacy, etc.). Treat unresolved compliance questions as requiring qualified legal review.

## User-facing surfaces

| Surface | Location | Purpose |
|---------|----------|---------|
| Consent banner | `src/components/AnalyticsConsent.astro` | First-visit choice for optional Google Analytics |
| Privacy Settings dialog | Same component; opened via footer | Change choice later |
| Privacy Policy | `src/pages/privacy/index.astro` | Describes GA4, Cloudflare, localStorage, submissions |
| Footer trigger | `src/components/SiteFooter.astro` — `data-open-privacy-settings` | Opens Privacy Settings |

Banner copy states that **Cloudflare Web Analytics** runs separately on the live site and is not affected by the GA choice.

## Consent storage

| Item | Value |
|------|--------|
| Mechanism | `localStorage` |
| Key | `vibeparenting-analytics-consent` (`src/lib/consent.ts` → `ANALYTICS_CONSENT_STORAGE_KEY`) |
| Values | `accepted` (`ANALYTICS_CONSENT_ACCEPTED`) or `declined` (`ANALYTICS_CONSENT_DECLINED`) |
| Scope | Per browser profile only; not synced across devices |
| Missing key | Banner shown (`consent === null`) |

Read/write helpers live in `src/scripts/analytics-consent.ts` (`readConsent`, `writeConsent`).

## Google Analytics loading behavior

Controlled by `initAnalyticsConsent()` in `src/scripts/analytics-consent.ts`:

1. On init: `setGoogleAnalyticsDisabled(measurementId, true)` using flag `ga-disable-G-YGH3N5GGPF`.
2. If stored consent is **accepted** and `analyticsEnabled` is true → `loadGoogleAnalytics()`.
3. If **declined** → `teardownGoogleAnalytics()`.
4. Accept/decline buttons call `applyConsent()` which persists choice and loads or tears down GA.

**Production only:** `AnalyticsConsent.astro` passes `analyticsEnabled: import.meta.env.PROD`. In local dev, accepting consent does **not** load GA4 (choice is still stored).

## Consent withdrawal

Declining from banner or Privacy Settings:

- Sets localStorage to `declined`
- Removes gtag script tags from DOM
- Sets `window.gtag` to no-op
- Resets `dataLayer`
- Clears GA cookies (`_ga`, `_gid`, `_gat*`) on common path/domain variants
- Sets `ga-disable-*` to true

After withdrawal, `trackAnalyticsEvent()` returns early; no new `/g/collect` requests from app code.

## API exposed to other scripts

```typescript
window.vibeParentingAnalytics = {
  hasAnalyticsConsent: () => readConsent() === ANALYTICS_CONSENT_ACCEPTED,
  getConsent: () => readConsent(),
};
```

Used by `hasAnalyticsConsentForEvents()` in `src/lib/analytics-events.ts`.

## gtag configuration flags (privacy-oriented)

On load, config includes (`loadGoogleAnalytics`):

- `send_page_view: true`
- `allow_google_signals: false`
- `allow_ad_personalization_signals: false`

Additional GA4 property-level controls (IP settings, data retention, ads personalization) **require manual verification in external dashboard**.

## Cloudflare Web Analytics vs Google consent

| | Google Analytics 4 | Cloudflare Web Analytics |
|--|-------------------|---------------------------|
| Controlled by banner | Yes | **No** |
| Implemented in repo | Yes (dynamic gtag) | No (hosting/dashboard) |
| Mentioned in privacy policy | Yes | Yes |

Declining Google Analytics **does not** disable Cloudflare Web Analytics. Visitors who need to avoid all third-party measurement may still receive Cloudflare’s beacon on production until hosting configuration changes.

## Cookies

- GA4 may set `_ga`, `_gid`, etc. when accepted and loaded.
- Teardown attempts to expire those cookies on decline.
- Consent choice itself is in **localStorage**, not a cookie.
- Privacy policy notes that blocking storage may prevent remembering the analytics choice.

## Data minimization in custom events

Custom events send only:

- Event name
- Optional `project_slug`, `project_name` (directory metadata)

No newsletter fields, mailto contents, or child-identifying data are sent via `trackAnalyticsEvent()`.

## Privacy limitations and open questions

- **Dual analytics:** Aggregate traffic exists via Cloudflare even when GA is declined.
- **Consent rate:** GA4 reports under-represent visitors who decline or use ad blockers.
- **No CMP / IAB TCF:** Simple accept/decline banner only; no granular purpose-based framework in code.
- **Children:** Site lists child-oriented projects; analytics is site-level usage, not child profiles—but legal interpretation for family/education sites is **unresolved in this documentation**.
- **Email submissions:** Mailto flows are outside analytics; content of emails is not tracked.
- **Regional requirements:** Geo-specific consent rules are not encoded in application logic.

## Related files

- `src/lib/consent.ts`
- `src/scripts/analytics-consent.ts`
- `src/components/AnalyticsConsent.astro`
- `src/pages/privacy/index.astro`

See also [architecture.md](./architecture.md) and [cloudflare-analytics.md](./cloudflare-analytics.md).

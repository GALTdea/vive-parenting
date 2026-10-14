# Google Analytics 4 — engagement events

Vibe Parenting loads **Google Analytics 4** (measurement ID `G-YGH3N5GGPF`) only after a visitor accepts optional analytics in the consent banner. **Cloudflare Web Analytics** is configured separately in hosting and is not controlled by this consent flow.

Custom engagement events are implemented in:

- `src/lib/analytics-events.ts` — event names and `trackAnalyticsEvent()`
- `src/scripts/init-analytics-events.ts` — delegated click handling
- `data-ga-event` (and optional project parameters) on instrumented elements

## Page views (project directory)

Project detail URLs follow `/projects/{slug}/` (for example `/projects/space-math-academy/`). GA4 **page_view** events are sent automatically via the existing `gtag('config', …, { send_page_view: true })` setup in `src/scripts/analytics-consent.ts`. No extra custom page_view events are fired.

Use **Reports → Engagement → Pages and screens** (or Explore with `page_path` / `page_location`) to compare project pages.

## Custom events

| Event name | Parameters | When it fires |
|------------|------------|---------------|
| `project_try_click` | `project_slug`, `project_name` | Primary **Try Project** button on a project detail page (hero CTA only). |
| `creator_link_click` | `project_slug`, `project_name` | **About the creator** profile link on a project detail page (not Sources & resources links). |
| `project_submit_click` | _(none)_ | Clicks that start submission: **Submit a Project** in the header, homepage hero, or **Submit Your Project** mailto on `/submit/`. Counts intent only—not a completed email send. |

No names, emails, form contents, or child-related PII are sent with these events.

## Consent behavior

- **No choice / declined:** `trackAnalyticsEvent()` does not call `gtag`; declined state replaces `gtag` with a no-op.
- **Accepted:** events are sent with standard `gtag('event', eventName, params)`.
- GA4 Enhanced Measurement may still record generic **outbound** clicks for external URLs; custom events use distinct names and parameters so they are not duplicated as custom outbound events.

## How to test locally

1. Build and preview (GA loads only in production mode):

   ```bash
   npm run build
   npm run preview
   ```

2. Open the preview URL (usually `http://localhost:4321`).

3. **Without consent:** open DevTools → Network, filter `collect` or `g/collect`. Browse and click instrumented controls — no GA4 requests after page load (GA script should not load).

4. **Accept analytics:** reload if needed, accept in the banner. Confirm `googletagmanager.com/gtag/js` loads.

5. **Project page:** visit `/projects/space-math-academy/` (or any listed project). Confirm a **page_view** in network requests to Google (`en=page_view`).

6. **Try Project:** click **Try Project** → request should include `en=project_try_click` and custom params `project_slug`, `project_name`.

7. **Creator link:** on a project with an **About the creator** section, click the profile link → `en=creator_link_click`.

8. **Submit:** click header **Submit a Project**, homepage **Submit a Project**, or `/submit/` **Submit Your Project** (mailto) → `en=project_submit_click`.

9. **Decline:** open **Privacy Settings** (footer), decline. Further clicks should not send new GA4 hits.

10. **DebugView (optional):** in GA4 Admin, enable [DebugView](https://support.google.com/analytics/answer/7201382) and add `debug_mode: true` temporarily in dev if you need live event validation (not enabled in production builds by default).

## Viewing events in GA4

- **Realtime → Event count by Event name** — quick check after testing.
- **Admin → Events** — register custom parameters (`project_slug`, `project_name`) as custom dimensions if you want them in standard reports.
- **Explore** — build a free-form report filtering `Event name` equals `project_try_click`, `creator_link_click`, or `project_submit_click`, and break down by `page_path` or custom parameters.

Events may take 24–48 hours to appear in some standard reports; Realtime and DebugView are fastest for verification.

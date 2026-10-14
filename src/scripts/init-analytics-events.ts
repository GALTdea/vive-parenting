import { trackAnalyticsEvent } from '../lib/analytics-events.ts';

const GA_EVENT_ATTR = 'data-ga-event';
const GA_PROJECT_SLUG_ATTR = 'data-ga-project-slug';
const GA_PROJECT_NAME_ATTR = 'data-ga-project-name';

function projectParamsFromElement(element: HTMLElement): Record<string, string> | undefined {
	const slug = element.getAttribute(GA_PROJECT_SLUG_ATTR);
	const name = element.getAttribute(GA_PROJECT_NAME_ATTR);
	if (!slug || !name) return undefined;
	return { project_slug: slug, project_name: name };
}

function handleTrackedClick(event: MouseEvent): void {
	if (event.defaultPrevented) return;
	if (event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

	const target = event.target;
	if (!(target instanceof Element)) return;

	const tracked = target.closest<HTMLElement>(`[${GA_EVENT_ATTR}]`);
	if (!tracked) return;

	const eventName = tracked.getAttribute(GA_EVENT_ATTR);
	if (!eventName) return;

	const params = projectParamsFromElement(tracked);
	trackAnalyticsEvent(eventName, params);
}

let engagementTrackingInitialized = false;

/** Delegated click tracking for consent-gated GA4 engagement events. */
export function initAnalyticsEngagementTracking(): void {
	if (engagementTrackingInitialized) return;
	engagementTrackingInitialized = true;
	document.addEventListener('click', handleTrackedClick);
}

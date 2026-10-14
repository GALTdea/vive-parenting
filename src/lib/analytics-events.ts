/** GA4 custom engagement event names (Stage 4). */
export const GA_EVENT_PROJECT_TRY_CLICK = 'project_try_click';
export const GA_EVENT_CREATOR_LINK_CLICK = 'creator_link_click';
export const GA_EVENT_PROJECT_SUBMIT_CLICK = 'project_submit_click';

export type GaProjectEventParams = {
	project_slug: string;
	project_name: string;
};

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		vibeParentingAnalytics?: {
			hasAnalyticsConsent: () => boolean;
		};
	}
}

/** Whether optional Google Analytics is allowed in this browser. */
export function hasAnalyticsConsentForEvents(): boolean {
	return window.vibeParentingAnalytics?.hasAnalyticsConsent() === true;
}

/**
 * Send a GA4 custom event when consent is granted.
 * Uses the existing gtag stub/loader; no-ops when analytics is disabled or declined.
 */
export function trackAnalyticsEvent(
	eventName: string,
	params?: Record<string, string>,
): void {
	if (!hasAnalyticsConsentForEvents()) return;
	if (typeof window.gtag !== 'function') return;
	window.gtag('event', eventName, params);
}

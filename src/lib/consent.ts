/** localStorage key for optional Google Analytics consent (accepted | declined). */
export const ANALYTICS_CONSENT_STORAGE_KEY = 'vibeparenting-analytics-consent';

export const ANALYTICS_CONSENT_ACCEPTED = 'accepted';
export const ANALYTICS_CONSENT_DECLINED = 'declined';

export const GA_MEASUREMENT_ID = 'G-YGH3N5GGPF';

export type AnalyticsConsentChoice =
	| typeof ANALYTICS_CONSENT_ACCEPTED
	| typeof ANALYTICS_CONSENT_DECLINED;

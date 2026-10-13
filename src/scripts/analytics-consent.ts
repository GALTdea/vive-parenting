import {
	ANALYTICS_CONSENT_ACCEPTED,
	ANALYTICS_CONSENT_DECLINED,
	ANALYTICS_CONSENT_STORAGE_KEY,
	type AnalyticsConsentChoice,
} from '../lib/consent.ts';

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
		vibeParentingAnalytics?: {
			hasAnalyticsConsent: () => boolean;
			getConsent: () => AnalyticsConsentChoice | null;
		};
	}
}

let gaInitialized = false;

function gaDisableFlag(measurementId: string): string {
	return `ga-disable-${measurementId}`;
}

function setGoogleAnalyticsDisabled(measurementId: string, disabled: boolean): void {
	window[gaDisableFlag(measurementId) as keyof Window] = disabled as never;
}

function noopGtag(): void {
	/* analytics withdrawn — ignore any late gtag calls */
}

function readConsent(): AnalyticsConsentChoice | null {
	try {
		const value = localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
		if (value === ANALYTICS_CONSENT_ACCEPTED || value === ANALYTICS_CONSENT_DECLINED) {
			return value;
		}
		return null;
	} catch {
		return null;
	}
}

function writeConsent(choice: AnalyticsConsentChoice): void {
	try {
		localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice);
	} catch {
		/* storage unavailable */
	}
}

function clearGoogleAnalyticsCookies(): void {
	const hostname = window.location.hostname;
	const domainParts = hostname.split('.');
	const baseDomain =
		domainParts.length > 2 ? domainParts.slice(-2).join('.') : hostname;

	for (const cookie of document.cookie.split(';')) {
		const name = cookie.split('=')[0]?.trim();
		if (!name || (!name.startsWith('_ga') && name !== '_gid' && !name.startsWith('_gat'))) {
			continue;
		}

		const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = `${name}=; expires=${expires}; path=/`;
		document.cookie = `${name}=; expires=${expires}; path=/; domain=${hostname}`;
		document.cookie = `${name}=; expires=${expires}; path=/; domain=.${hostname}`;
		if (baseDomain !== hostname) {
			document.cookie = `${name}=; expires=${expires}; path=/; domain=.${baseDomain}`;
		}
	}
}

function teardownGoogleAnalytics(measurementId: string): void {
	setGoogleAnalyticsDisabled(measurementId, true);

	document
		.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')
		.forEach((node) => node.remove());

	window.gtag = noopGtag;
	window.dataLayer = [];
	gaInitialized = false;
	clearGoogleAnalyticsCookies();
}

function loadGoogleAnalytics(measurementId: string): void {
	if (gaInitialized || readConsent() !== ANALYTICS_CONSENT_ACCEPTED) return;

	setGoogleAnalyticsDisabled(measurementId, false);
	gaInitialized = true;

	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag(...args: unknown[]) {
		if (readConsent() !== ANALYTICS_CONSENT_ACCEPTED) return;
		window.dataLayer?.push(args);
	};
	window.gtag('js', new Date());

	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
	script.onload = () => {
		if (readConsent() !== ANALYTICS_CONSENT_ACCEPTED) {
			teardownGoogleAnalytics(measurementId);
			return;
		}
		setGoogleAnalyticsDisabled(measurementId, false);
		window.gtag?.('config', measurementId, {
			send_page_view: true,
			allow_google_signals: false,
			allow_ad_personalization_signals: false,
		});
	};
	document.head.appendChild(script);
}

function setBannerVisible(banner: HTMLElement, visible: boolean): void {
	banner.hidden = !visible;
}

function setSettingsOpen(settingsDialog: HTMLDialogElement, open: boolean): void {
	if (open) {
		if (!settingsDialog.open) settingsDialog.showModal();
	} else if (settingsDialog.open) {
		settingsDialog.close();
	}
}

function updateSettingsStatus(statusEl: HTMLElement, consent: AnalyticsConsentChoice | null): void {
	if (consent === ANALYTICS_CONSENT_ACCEPTED) {
		statusEl.textContent = 'Your current choice: Google Analytics accepted.';
		return;
	}
	if (consent === ANALYTICS_CONSENT_DECLINED) {
		statusEl.textContent = 'Your current choice: Google Analytics declined.';
		return;
	}
	statusEl.textContent = 'You have not chosen yet.';
}

function applyConsent(
	choice: AnalyticsConsentChoice,
	options: {
		measurementId: string;
		analyticsEnabled: boolean;
		banner: HTMLElement;
		statusEl: HTMLElement;
		settingsDialog: HTMLDialogElement;
	},
): void {
	writeConsent(choice);
	setBannerVisible(options.banner, false);
	updateSettingsStatus(options.statusEl, choice);

	if (choice === ANALYTICS_CONSENT_ACCEPTED && options.analyticsEnabled) {
		loadGoogleAnalytics(options.measurementId);
		setSettingsOpen(options.settingsDialog, false);
		return;
	}

	teardownGoogleAnalytics(options.measurementId);
	setSettingsOpen(options.settingsDialog, false);
}

export function initAnalyticsConsent(options: {
	measurementId: string;
	analyticsEnabled: boolean;
	banner: HTMLElement;
	settingsDialog: HTMLDialogElement;
	statusEl: HTMLElement;
	openSettingsTriggers: HTMLElement[];
	acceptButtons: HTMLElement[];
	declineButtons: HTMLElement[];
}): void {
	const {
		measurementId,
		analyticsEnabled,
		banner,
		settingsDialog,
		statusEl,
		openSettingsTriggers,
		acceptButtons,
		declineButtons,
	} = options;

	window.vibeParentingAnalytics = {
		hasAnalyticsConsent: () => readConsent() === ANALYTICS_CONSENT_ACCEPTED,
		getConsent: () => readConsent(),
	};

	setGoogleAnalyticsDisabled(measurementId, true);

	const consent = readConsent();
	updateSettingsStatus(statusEl, consent);
	setBannerVisible(banner, consent === null);

	if (consent === ANALYTICS_CONSENT_ACCEPTED && analyticsEnabled) {
		loadGoogleAnalytics(measurementId);
	} else if (consent === ANALYTICS_CONSENT_DECLINED) {
		teardownGoogleAnalytics(measurementId);
	}

	const consentOptions = {
		measurementId,
		analyticsEnabled,
		banner,
		statusEl,
		settingsDialog,
	};

	for (const trigger of openSettingsTriggers) {
		trigger.addEventListener('click', () => {
			updateSettingsStatus(statusEl, readConsent());
			setSettingsOpen(settingsDialog, true);
		});
	}

	for (const button of acceptButtons) {
		button.addEventListener('click', () => {
			applyConsent(ANALYTICS_CONSENT_ACCEPTED, consentOptions);
		});
	}

	for (const button of declineButtons) {
		button.addEventListener('click', () => {
			applyConsent(ANALYTICS_CONSENT_DECLINED, consentOptions);
		});
	}

	settingsDialog.addEventListener('cancel', (event) => {
		event.preventDefault();
		setSettingsOpen(settingsDialog, false);
	});

	settingsDialog.addEventListener('click', (event) => {
		const target = event.target;
		if (target instanceof HTMLElement && target.dataset.closeSettings !== undefined) {
			setSettingsOpen(settingsDialog, false);
		}
	});
}

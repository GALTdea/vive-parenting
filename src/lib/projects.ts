import type { CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export type EditorialStatus = ProjectEntry['data']['editorialStatus'];

export function isPublishedProject(status: EditorialStatus | undefined): boolean {
	return status === 'published';
}

/** Include all statuses in dev; only published entries in production builds. */
export function isProjectVisible(entry: ProjectEntry): boolean {
	const status = entry.data.editorialStatus ?? 'draft';
	return import.meta.env.PROD ? isPublishedProject(status) : true;
}

export function projectSeo(entry: ProjectEntry) {
	const { data } = entry;
	if (data.seo) {
		return {
			title: data.seo.title,
			description: data.seo.description,
			ogTitle: data.seo.ogTitle ?? data.seo.title,
			ogDescription: data.seo.ogDescription ?? data.seo.description,
		};
	}

	return {
		title: `${data.title} — Vibe Parenting`,
		description: data.summary,
		ogTitle: `${data.title} | Vibe Parenting`,
		ogDescription: data.summary,
	};
}

export function projectCoverImage(entry: ProjectEntry): { src: string; alt: string } {
	const { data } = entry;
	if (data.media) {
		return { src: data.media.src, alt: data.media.alt };
	}
	if (data.coverImage) {
		return { src: data.coverImage, alt: `${data.title} cover` };
	}
	return { src: '/favicon.svg', alt: data.title };
}

export function projectCategory(entry: ProjectEntry): string | undefined {
	return entry.data.category;
}

export function normalizeLabel(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
}

/** Short directory chip. Prefer `category`; `learningAreas` are long-form outcomes. */
/** Primary browse taxonomy for directory filters and cards. */
export const BROWSE_CATEGORIES = [
	'Mathematics',
	'Science & STEM',
	'AI Literacy',
	'Coding',
	'Financial Literacy',
] as const;

export type BrowseCategory = (typeof BROWSE_CATEGORIES)[number];

export function projectBrowseCategory(entry: ProjectEntry): string {
	const raw = entry.data.category ?? entry.data.learningAreas[0] ?? 'Uncategorized';
	return normalizeLabel(raw);
}

/** Concise age label for project cards; omit when not set. */
export function projectCardAgeDisplay(entry: ProjectEntry): string | undefined {
	const label = entry.data.ageDisplay?.trim();
	return label || undefined;
}

export function compareDirectoryProjects(a: ProjectEntry, b: ProjectEntry): number {
	const featuredRank = (entry: ProjectEntry) => (entry.data.featured === true ? 0 : 1);
	const byFeatured = featuredRank(a) - featuredRank(b);
	if (byFeatured !== 0) return byFeatured;
	return a.data.title.localeCompare(b.data.title, 'en', { sensitivity: 'base' });
}

export function sortDirectoryProjects(entries: ProjectEntry[]): ProjectEntry[] {
	return [...entries].sort(compareDirectoryProjects);
}

export function directoryFilterLabels(entries: ProjectEntry[]): string[] {
	const present = new Set(entries.map(projectBrowseCategory));
	return BROWSE_CATEGORIES.filter((label) => present.has(label));
}

export function isBrowseCategory(value: string): value is BrowseCategory {
	return (BROWSE_CATEGORIES as readonly string[]).includes(value);
}

export function projectDirectorySearchText(entry: ProjectEntry): string {
	const { title, summary, category, learningAreas } = entry.data;
	return [title, summary, category, ...learningAreas]
		.filter((value): value is string => Boolean(value))
		.map(normalizeLabel)
		.join(' ')
		.toLowerCase();
}

export function projectHasCoverImage(entry: ProjectEntry): boolean {
	return Boolean(entry.data.media?.src || entry.data.coverImage);
}

export function whatKidsDoParagraphs(entry: ProjectEntry): string[] {
	return entry.data.whatKidsDo ?? [];
}

export function projectCreatorBlock(entry: ProjectEntry) {
	const { data } = entry;
	if (data.creator) {
		return data.creator;
	}
	if (data.creatorName) {
		return {
			name: data.creatorName,
			description: '',
			profileUrl: data.creatorUrl ?? data.projectUrl,
			profileLabel: data.creatorName,
		};
	}
	return undefined;
}

export function projectResourceLinks(entry: ProjectEntry) {
	return entry.data.sourceLinks ?? [];
}

type YesNoUnknown = NonNullable<ProjectEntry['data']['accountRequired']>;

export function formatYesNoUnknown(
	value: YesNoUnknown | undefined,
	notConfirmedLabel = 'Not confirmed',
): string {
	if (value === 'yes') return 'Yes';
	if (value === 'no') return 'No';
	if (value === 'unknown') return notConfirmedLabel;
	return notConfirmedLabel;
}

export type VerificationLevel = NonNullable<ProjectEntry['data']['verificationLevel']>;

export function verificationParentMessage(level: VerificationLevel): string {
	switch (level) {
		case 'unverified':
			return 'We haven’t independently checked this project yet.';
		case 'documentation_verified':
			return 'We reviewed the project’s documentation.';
		case 'website_verified':
			return 'We reviewed the public website, but haven’t completed the activity.';
		case 'interface_observed':
			return 'We opened the project’s interface, but haven’t completed the full activity.';
		case 'playtested':
			return 'We tried the learning experience.';
		default:
			return 'We haven’t independently checked this project yet.';
	}
}

export function formatLastVerifiedAt(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	}).format(date);
}

const PRACTICAL_ROW_LABELS = new Set([
	'Platform',
	'Language',
	'Pricing',
	'Account required',
	'Installation required',
	'Specialized hardware required',
]);

/** Omit parentInfo rows that the template renders from structured access fields. */
export function parentInfoWithoutPracticalDuplicates(
	rows: ProjectEntry['data']['parentInfo'],
): NonNullable<ProjectEntry['data']['parentInfo']> {
	if (!rows?.length) return [];
	return rows.filter((row) => !PRACTICAL_ROW_LABELS.has(row.label));
}

export function projectPracticalRequirementRows(
	data: ProjectEntry['data'],
): { label: string; value: string }[] {
	const rows: { label: string; value: string }[] = [];

	if (data.platforms?.length) {
		rows.push({ label: 'Platform', value: data.platforms.join(', ') });
	}
	if (data.languages?.length) {
		rows.push({ label: 'Language', value: data.languages.join(', ') });
	}
	if (data.pricing?.trim()) {
		rows.push({ label: 'Pricing', value: data.pricing.trim() });
	}
	if (data.accountRequired !== undefined) {
		rows.push({
			label: 'Account required',
			value: formatYesNoUnknown(data.accountRequired),
		});
	}
	if (data.installationRequired !== undefined) {
		rows.push({
			label: 'Installation required',
			value: formatYesNoUnknown(data.installationRequired),
		});
	}
	if (data.hardwareRequired !== undefined) {
		rows.push({
			label: 'Specialized hardware required',
			value: formatYesNoUnknown(data.hardwareRequired),
		});
	}

	return rows;
}

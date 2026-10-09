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

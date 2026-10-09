import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yesNoUnknown = z.enum(['yes', 'no', 'unknown']);

const verificationLevel = z.enum([
	'unverified',
	'documentation_verified',
	'website_verified',
	'interface_observed',
	'playtested',
]);

const editorialStatus = z.enum(['draft', 'review', 'published']);

const labeledUrl = z.object({
	label: z.string(),
	href: z.string().url(),
	description: z.string().optional(),
});

const parentInfoRow = z.object({
	label: z.string(),
	value: z.string(),
});

const projectMedia = z.object({
	src: z.string(),
	alt: z.string(),
	caption: z.string().optional(),
});

const projectSeo = z.object({
	title: z.string(),
	description: z.string(),
	ogTitle: z.string().optional(),
	ogDescription: z.string().optional(),
});

const projectCreator = z.object({
	name: z.string(),
	description: z.string(),
	profileUrl: z.string().url(),
	profileLabel: z.string(),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		projectUrl: z.string().url(),
		learningAreas: z.array(z.string()).min(1),
		projectType: z.string(),
		featured: z.boolean().optional(),
		coverImage: z.string().optional(),
		/** Short topic label for cards and hero badge (e.g. Mathematics). */
		category: z.string().optional(),

		ageRange: z.string().optional(),
		skills: z.array(z.string()).optional(),
		whatKidsDo: z.array(z.string()).optional(),
		whatKidsLearn: z.string().optional(),
		interactionType: z.string().optional(),
		aiRole: z.string().optional(),
		parentInvolvement: z.string().optional(),

		pricing: z.string().optional(),
		platforms: z.array(z.string()).optional(),
		languages: z.array(z.string()).optional(),
		accountRequired: yesNoUnknown.optional(),
		installationRequired: yesNoUnknown.optional(),
		apiKeyRequired: yesNoUnknown.optional(),
		hardwareRequired: yesNoUnknown.optional(),

		creatorName: z.string().optional(),
		creatorUrl: z.string().url().optional(),
		sourceUrl: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		sourceLinks: z.array(labeledUrl).optional(),

		creator: projectCreator.optional(),
		parentInfo: z.array(parentInfoRow).optional(),
		media: projectMedia.optional(),
		seo: projectSeo.optional(),

		whyInteresting: z.string().optional(),
		parentNotes: z.string().optional(),
		limitations: z.array(z.string()).optional(),
		verificationLevel: verificationLevel.optional(),
		lastVerifiedAt: z.coerce.date().optional(),
		editorialStatus: editorialStatus.default('draft'),
		publishedAt: z.coerce.date().optional(),
	}),
});

export const collections = { projects };

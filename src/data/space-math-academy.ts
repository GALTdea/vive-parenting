export type InfoRow = {
	label: string;
	value: string;
};

export type ResourceLink = {
	label: string;
	href: string;
	description?: string;
};

export const spaceMathAcademy = {
	slug: 'space-math-academy',
	name: 'Space Math Academy',
	category: 'Mathematics',
	projectType: 'Interactive educational game',
	ageRange: 'K–12',
	shortDescription:
		'Explore mathematics through interactive space missions inspired by NASA educational problems.',
	tryUrl: 'https://space-math.academy',
	demoUrl: 'https://x.com/DynamicWebPaige/status/2002421928032714907',
	media: {
		src: '/projects/space-math-academy/hero.png',
		alt: 'Space Math Academy mission control login screen with NASA SpaceMath branding',
		caption: 'Screenshot from the live project at space-math.academy',
	},
	whatKidsDo: [
		'Children step into space-themed missions framed as NASA mission control training.',
		'They work through mathematics and physics problems drawn from the NASA Space Math curriculum— the same kinds of calculations scientists use for orbits, trajectories, and mission planning.',
		'A sci-fi storyline and voice narration help the missions feel like an urgent space operation rather than a static worksheet.',
	],
	learningAreas: [
		'Mathematical reasoning and applied problem-solving',
		'Physics and math in real NASA mission contexts',
		'Connecting classroom math to space exploration scenarios',
	],
	parentInfo: [
		{ label: 'Intended age range', value: 'K–12 (as stated by the project)' },
		{ label: 'Platform', value: 'Web browser' },
		{ label: 'Getting started', value: 'Enter a cadet display name on the project site; no sign-up flow was observed on the public site' },
		{ label: 'Language', value: 'English' },
	] satisfies InfoRow[],
	creator: {
		name: 'Paige Bailey',
		description:
			'Paige Bailey built Space Math Academy as a tribute to the NASA Space Math curriculum, using Google Colab and Google AI Studio’s Build feature to turn archived PDF problem sets into an interactive web experience.',
		profileUrl: 'https://github.com/dynamicwebpaige',
		profileLabel: 'Paige Bailey on GitHub',
	},
	resources: [
		{
			label: 'Official project website',
			href: 'https://space-math.academy',
			description: 'Play Space Math Academy in your browser',
		},
		{
			label: 'GitHub repository',
			href: 'https://github.com/dynamicwebpaige/space-math',
			description: 'Source code and local setup notes',
		},
		{
			label: 'Original announcement',
			href: 'https://x.com/DynamicWebPaige/status/2002421928032714907',
			description: 'Introduction post with demonstration video',
		},
	] satisfies ResourceLink[],
	seo: {
		title: 'Space Math Academy — Vibe Parenting',
		description:
			'An interactive space mission game that turns NASA Space Math problems into K–12 learning experiences. See what kids do, what it covers, and how to try it.',
		ogTitle: 'Space Math Academy | Vibe Parenting',
		ogDescription:
			'Interactive NASA-inspired math missions for K–12 learners—what kids do, what they can practice, and how to access it.',
	},
} as const;

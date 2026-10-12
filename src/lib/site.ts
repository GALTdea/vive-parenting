const DEFAULT_SUBMISSION_EMAIL = 'gustavo.devvv@gmail.com';

/** Inbound address for project submissions (mailto). Override with SUBMISSION_EMAIL or PUBLIC_SUBMISSION_EMAIL. */
export function submissionEmailAddress(): string {
	const fromPrivate = import.meta.env.SUBMISSION_EMAIL?.trim() ?? '';
	const fromPublic = import.meta.env.PUBLIC_SUBMISSION_EMAIL?.trim() ?? '';
	return fromPrivate || fromPublic || DEFAULT_SUBMISSION_EMAIL;
}

const SUBMISSION_SUBJECT = 'Vibe Parenting — Project Submission';

const SUBMISSION_BODY = `Project Name:

Project URL:

What does your project do?

Who is it designed for? (Optional)

Your Name: (Optional)

Additional Notes: (Optional)
`;

/** Prefilled mailto URL for project submissions, or null if no address is configured. */
export function projectSubmissionMailto(): string | null {
	const email = submissionEmailAddress();
	if (!email) return null;

	const params = new URLSearchParams({
		subject: SUBMISSION_SUBJECT,
		body: SUBMISSION_BODY,
	});

	return `mailto:${email}?${params.toString()}`;
}

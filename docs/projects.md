# Adding educational projects

Project listings are powered by [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/). Each project is one Markdown file with YAML frontmatter plus an optional Markdown body for long-form sections.

## Where content lives

| Path | Purpose |
| --- | --- |
| `src/content/projects/*.md` | Project records (one file per project) |
| `src/content.config.ts` | Collection loader and Zod schema |
| `public/projects/<slug>/` | Screenshots and static media (recommended) |
| `src/pages/projects/[slug].astro` | Dynamic route (do not add per-project pages) |
| `src/components/projects/ProjectDetail.astro` | Shared project layout |

The URL slug is the filename without extension (e.g. `space-math-academy.md` → `/projects/space-math-academy/`).

## Create a new project

1. Copy `src/content/projects/space-math-academy.md` as a template.
2. Rename the file to your slug (lowercase, hyphen-separated).
3. Update frontmatter fields (see required fields below).
4. Add images under `public/projects/<slug>/` and reference them in `media.src` or `coverImage`.
5. Set `editorialStatus` to `review` while editing; set to `published` when ready for production.
6. Run `npm run build` to validate the schema and generate pages.

### Required frontmatter

- `title` — display name
- `summary` — short card / hero description
- `projectUrl` — primary “Try project” link (HTTPS URL)
- `learningAreas` — array of learning focus strings (at least one)
- `projectType` — e.g. “Interactive educational game”
- `editorialStatus` — `draft`, `review`, or `published` (defaults to `draft` if omitted)

### Common optional fields

- `featured: true` — homepage featured card (first featured visible project wins)
- `category` — short badge on cards and hero (e.g. “Mathematics”)
- `ageRange`, `whatKidsDo` (array of paragraphs), `demoUrl`, `sourceLinks`, `parentInfo`, `media`, `seo`, `creator`, creatorName / creatorUrl

Use `yes` / `no` / `unknown` for `accountRequired`, `installationRequired`, `apiKeyRequired`, and `hardwareRequired` when known.

### Screenshots

Place files in `public/` and use site-root paths:

```yaml
media:
  src: /projects/my-project/hero.png
  alt: Describe the screenshot for accessibility
  caption: Optional caption under the hero image
```

### SEO

Optional `seo` block overrides default title and description:

```yaml
seo:
  title: My Project — Vibe Parenting
  description: Meta description for search and social previews.
  ogTitle: Optional Open Graph title
  ogDescription: Optional Open Graph description
```

### Markdown body

Use the body for sections such as overview, extended parent notes, or sources narrative. The template renders an **Overview** section only when the body is non-empty. Structured lists (learning areas, resources, etc.) stay in frontmatter.

## Editorial status

| Status | Development (`npm run dev`) | Production (`npm run build`) |
| --- | --- | --- |
| `draft` | Visible | **Not** built or listed |
| `review` | Visible | **Not** built or listed |
| `published` | Visible | Built and public |

Filtering is implemented in `src/lib/projects.ts` (`isProjectVisible`). The homepage and `getStaticPaths` for project pages both use this helper.

## Preview and publish

1. **Preview locally:** `npm run dev` — draft and review entries are available at `/projects/<slug>/`.
2. **Validate:** `npm run build` — schema errors fail the build; unpublished projects are omitted from output.
3. **Publish:** Set `editorialStatus: published` (and optionally `publishedAt`) before deploying.

## Minimal example

```markdown
---
title: Example Learning Lab
summary: A short description for cards and the hero.
projectUrl: https://example.com
learningAreas:
  - Creative problem solving
projectType: Web app
editorialStatus: draft
featured: false
category: Science
media:
  src: /projects/example-learning-lab/hero.png
  alt: Screenshot of the Example Learning Lab home screen
---

## Overview

Optional long-form copy appears under **Overview** on the project page.
```

## Validate the collection

```sh
npm run build
```

A successful production build confirms frontmatter matches the schema in `src/content.config.ts`. Fix any Zod validation errors reported by the CLI.

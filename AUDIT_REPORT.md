# Technical & Strategic Audit — habib-portfolio

This report captures a full frontend/UX audit with prioritized issues and a refactoring roadmap.

## Critical Issues
- Build and lint workflow is brittle (`next lint` script is broken in this setup and production build currently depends on Google font fetch reliability).
- Portfolio content quality is inconsistent and includes placeholder/template data, duplicate project entries, and unfinished case studies.
- Security exposure: OG fetch/proxy API routes can be abused for SSRF-like access patterns due to unrestricted URL fetching.

## Important Improvements
- Consolidate duplicated data-loading logic and improve TypeScript safety around metadata/frontmatter.
- Normalize SEO semantics, heading structure, and page schemas.
- Tighten UX consistency (spacing scale, CTA clarity, mobile nav behavior, social labels).

## Nice-to-have Enhancements
- Dynamic imports and conditional loading for heavier sections.
- Stronger media pipeline (modern formats, explicit dimensions, compressed assets).
- Better content strategy (outcome metrics, process narrative, role clarity per project).

## 7-Day Action Plan
1. Fix build/lint pipeline and lock CI checks.
2. Remove placeholder content and duplicate project pages.
3. Harden OG/proxy API endpoints with allowlists and validation.
4. Refactor data layer (`getPosts`) with typed frontmatter schema validation.
5. Improve semantic hierarchy and metadata consistency.
6. Polish UX system (spacing, typography rhythm, clearer CTAs, accessibility pass).
7. Publish 2-3 real case studies with measurable outcomes and process artifacts.

## Refactoring Roadmap (file-focused)
- `src/utils/utils.ts`: introduce zod schema for frontmatter, return typed entities, split IO/parsing concerns.
- `src/components/work/Projects.tsx` + `src/components/blog/Posts.tsx`: extract shared post listing/sorting utility.
- `src/resources/content.tsx`: move large content blobs into dedicated data modules (`src/content/*.ts`) and keep config lean.
- `src/app/api/og/fetch/route.ts` + `src/app/api/og/proxy/route.ts`: enforce protocol/hostname allowlist + size/time limits.
- `src/app/about/page.tsx`: split into sectional components for maintainability.
- `src/components/Header.tsx`: remove stray literal text and simplify mobile/desktop toggle duplication.
- `src/app/work/projects/*.mdx`: replace template projects with complete case studies and unique slugs.

## Suggested folder structure

```txt
src/
  app/
    (marketing)/
      page.tsx
      about/page.tsx
      work/page.tsx
      blog/page.tsx
      gallery/page.tsx
    work/[slug]/page.tsx
    blog/[slug]/page.tsx
    api/
      og/
      rss/
      auth/
  components/
    layout/
    navigation/
    sections/
    content/
  content/
    site.ts
    about.ts
    projects/
      *.mdx
    posts/
      *.mdx
  lib/
    posts/
      parser.ts
      queries.ts
      schema.ts
  styles/
    tokens.css
    globals.css
```

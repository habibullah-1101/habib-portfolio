# habib-portfolio

Habib Portfolio is the personal website of **Habib Hussaini (Habib)**, a **Senior Graphic Designer** focused on branding, print, and real-world visual systems. This project presents his services, selected projects, and professional profile.

## Live Demo

- **URL:** TODO (add the production URL)
- Note: The current `baseURL` in config still points to a template demo URL and should be updated for production.

## Features

- Home page with designer profile intro and highlighted work.
- About page with introduction, work experience, services, and skills.
- Work/projects section using MDX project files.
- Gallery page for image-based portfolio content.
- Optional blog system (implemented in code, currently disabled in route config).
- SEO helpers including metadata, sitemap, robots, RSS, and Open Graph image routes.
- Route toggles and optional password-protected routes via config.
- Theme switching support.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI System:** Once UI (`@once-ui-system/core`)
- **Content format:** MDX
- **Deployment target:** Vercel

## Project Structure

Key directories and files:

- `src/app` – App Router pages, API routes, and MDX content routes.
- `src/components` – Shared UI and feature components.
- `src/resources/content.tsx` – Main portfolio content (personal info, sections, labels).
- `src/resources/once-ui.config.ts` – App/site configuration (routes, styling, SEO base URL, etc.).
- `public/images` – Portfolio and gallery image assets.

## Getting Started

### Prerequisites

- Node.js 18.17+ (or a newer LTS version)
- npm

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Environment Variables

This project currently uses:

- `PAGE_ACCESS_PASSWORD` (optional): Enables password checks for protected routes when configured.

Chatbot note:

- `OPENAI_API_KEY`: TODO (no chatbot/OpenAI integration was found in the current codebase; add this only if chatbot functionality is implemented).

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Set required environment variables in Vercel Project Settings.
4. Deploy.

## Customization

- Edit portfolio content in: `src/resources/content.tsx`
- Edit configuration (routes, base URL, style, SEO defaults) in: `src/resources/once-ui.config.ts`
- Add/update images in:
  - `public/images`
  - `src/resources` (for resource/config references)

## License

Licensed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. See `LICENSE` for details.

## Credits / Author

Designed & built by Habib Hussaini.

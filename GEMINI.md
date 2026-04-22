# Sona-Docs Project Context

This project is a landing page for **Sona**, an offline transcript editor. It is built as a Next.js 15 application for the public `Sona-Docs` site and local agent-assisted editing workflows.

## Project Overview
- **Purpose:** A minimalist, warm landing page showcasing the Sona offline transcript editor.
- **Key Technologies:** 
  - **Framework:** Next.js 15 (App Router)
  - **Library:** React 19
  - **Styling:** Tailwind CSS 4, Lucide React (icons)
  - **Animations:** Motion (Framer Motion)
  - **AI Integration:** `@google/genai` (prepared for Gemini integration)
- **Architecture:** Standard Next.js App Router structure with a focus on high-quality frontend design and internationalization (supports English and Chinese).

## Building and Running
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`
- **Cleanup:** `npm run clean`

*Note: For local development, set `GEMINI_API_KEY` in `.env.local`.*

## Development Conventions

### Local Editing Specifics
- **HMR Handling:** `next.config.ts` contains a specific Webpack configuration that disables file watching if `DISABLE_HMR=true`. This helps prevent flickering during agent-based edits in constrained host environments. **Do not modify this logic.**
- **Output:** The project is configured for `standalone` output in `next.config.ts`.

### Coding Standards
- **Component Pattern:** Uses `'use client'` for interactive components (e.g., `Home` component in `app/page.tsx`).
- **Styling:** Prefers utility-first CSS with Tailwind CSS 4. Uses `clsx` and `tailwind-merge` (via `lib/utils.ts` `cn` helper) for dynamic class names.
- **Icons:** Use `lucide-react` for consistent iconography.
- **Animations:** Use `motion` for polished UI transitions and entry animations.
- **Fonts:** Uses Google Fonts (`Inter` for sans, `Cormorant Garamond` for serif) configured via `next/font`.

### Internationalization
- Currently implemented manually within components (see `app/page.tsx`) using a `translations` object and local state for language switching (`zh` and `en`).

## Key Files
- `app/page.tsx`: Main landing page content and layout.
- `app/layout.tsx`: Root layout with font configurations and global styles.
- `metadata.json`: Local workspace metadata for the site wrapper.
- `next.config.ts`: Next.js configuration including the optional `DISABLE_HMR` override for agent-driven editing.
- `lib/utils.ts`: Tailwind CSS class merging utility.

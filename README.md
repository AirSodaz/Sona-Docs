# Sona | Offline Transcript Editor Landing Page

A lightweight landing page for **Sona**, the offline transcript editor built with Tauri and Sherpa-onnx. The site is built with Next.js App Router and is ready to deploy on Vercel.

## Overview

Sona is designed for people who want privacy, speed, and local-first transcription. This site reflects that with a compact bilingual landing page, a release-aware download button, and metadata tuned for production deployment.

### Highlighted Product Capabilities
- **Local processing:** Speech recognition runs on-device with Sherpa-onnx.
- **LLM assistant:** Local models can help polish, summarize, and translate transcripts.
- **High accuracy:** Tuned for long-form audio and readable punctuation recovery.
- **Transcript editor:** A focused editor for proofreading, timestamps, and cleanup.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GITHUB_TOKEN=your_github_token_here
```

`GITHUB_TOKEN` is optional locally, but recommended if you want `/api/github-release` to avoid anonymous GitHub API rate limits.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run lint
npm run build
npm run start
```

## Vercel Deployment

### Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`
  - Set this to your production domain, such as `https://sona.yourdomain.com`.
  - If you do not have a custom domain yet, use your production Vercel domain.
- `GITHUB_TOKEN`
  - Recommended for `/api/github-release`.
  - Use a read-only token for public repository access.

### Notes

- `/` and `/zh` are statically generated.
- `/api/github-release` stays dynamic, but its upstream GitHub response is cached and protected with a timeout.
- `robots.txt`, `sitemap.xml`, and a stable Open Graph image are generated from the app itself.

## License

This project is open-sourced under the MIT License.

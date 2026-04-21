# Sona | Offline Transcript Editor Landing Page

A minimalist, high-performance landing page for **Sona**, an offline transcript editor built with Tauri and Sherpa-onnx. This repository contains the source code for the Sona project's web presence, designed as an AI Studio Applet.

## 🚀 Overview

Sona is designed for users who prioritize privacy and speed in their transcription workflow. This landing page reflects those values through a clean, "quiet" aesthetic and smooth interactions.

### Key Features of Sona (Highlighted)
- **Local Processing:** Complete privacy with on-device speech recognition via Sherpa-onnx.
- **LLM Assistant:** Built-in capabilities for polishing, summarizing, and translating transcripts using local models.
- **High Accuracy:** Commercial-grade ASR tailored for long-form audio.
- **Rich Text Editor:** Immersive React-based editor for seamless proofreading and timestamp alignment.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** Optimized for Google AI Studio Applet environments.

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sona-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building

To create an optimized production build:
```bash
npm run build
npm run start
```

## 📄 License

This project is open-sourced under the MIT License.

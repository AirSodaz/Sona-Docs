import type { ReactNode } from 'react';
import Link from 'next/link';
import { Github, Mic, Shield, Bot, Scissors, Globe } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { DownloadButton } from '@/components/download-button';
import { TranscriptDemo } from '@/components/transcript-demo';
import type { HomePageContent } from '@/lib/homepage-content';

export function HomePage({ content }: { content: HomePageContent }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#F7F5F2] text-[#2D2D2D] dark:bg-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
      <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[500px] sm:w-[500px] sm:blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[600px] sm:w-[600px] sm:blur-[120px]"></div>

      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-5 sm:px-6 sm:py-8 md:px-16">
        <div className="flex items-center">
          <Logo className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
          <span
            className="-ml-1 mt-0.5 text-[1.55rem] font-serif italic tracking-tighter text-[#5c4d43] dark:text-[#E0E0E0] sm:text-[1.7rem]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ona
          </span>
        </div>
        <div className="flex items-center gap-4 text-[13px] font-medium text-stone-500 dark:text-stone-400 sm:gap-6 sm:text-sm md:gap-8">
          <ThemeToggle />
          <Link
            href={content.nav.languageToggleHref}
            className="flex items-center gap-1.5 transition-colors hover:text-stone-800 focus:outline-none cursor-pointer dark:hover:text-stone-200"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{content.nav.languageToggleLabel}</span>
            <span className="sm:hidden">{content.nav.languageToggleShortLabel}</span>
          </Link>
          <Link
            href="https://github.com/AirSodaz/sona"
            className="flex items-center gap-1.5 transition-colors hover:text-stone-800 dark:hover:text-stone-200 sm:gap-2"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            <span className="hidden sm:inline">{content.nav.github}</span>
          </Link>
        </div>
      </header>

      <main className="mt-6 flex w-full flex-1 flex-col items-center px-4 pb-10 sm:mt-10 sm:px-6 sm:pb-12 md:px-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400 shadow-sm transition-colors duration-300 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-500 sm:mb-8 sm:px-4 sm:text-xs sm:tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 dark:bg-stone-500 opacity-30"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-400 dark:bg-stone-500"></span>
            </span>
            {content.hero.badge}
          </div>

          <h1
            className="mb-5 text-[clamp(3rem,15vw,4.5rem)] leading-[0.95] font-serif italic text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] sm:mb-6 sm:text-6xl md:text-7xl"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {content.hero.title1} <br />
            <span className="text-stone-500 dark:text-stone-400 font-light transition-colors duration-300">
              {content.hero.title2}
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-[1.05rem] font-light leading-[1.8] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:mb-10 sm:text-lg">
            {content.hero.desc}
          </p>

          <div className="mb-12 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mb-16 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
            <DownloadButton text={content.hero.btnDownload} />
            <Link
              href={content.hero.docsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-[#2D2D2D] transition-colors hover:bg-white dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 sm:w-auto sm:px-8"
            >
              {content.hero.btnDocs}
            </Link>
          </div>
        </div>

        <div className="mt-2 w-full">
          <TranscriptDemo demo={content.demo} />
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-4xl gap-10 text-left sm:mt-20 sm:grid-cols-2 sm:gap-12">
          <FeatureCard
            icon={<Shield size={20} className="text-stone-600 dark:text-stone-400" />}
            title={content.features[0].title}
            description={content.features[0].desc}
          />
          <FeatureCard
            icon={<Bot size={20} className="text-stone-600 dark:text-stone-400" />}
            title={content.features[1].title}
            description={content.features[1].desc}
          />
          <FeatureCard
            icon={<Mic size={20} className="text-stone-600 dark:text-stone-400" />}
            title={content.features[2].title}
            description={content.features[2].desc}
          />
          <FeatureCard
            icon={<Scissors size={20} className="text-stone-600 dark:text-stone-400" />}
            title={content.features[3].title}
            description={content.features[3].desc}
          />
        </div>
      </main>

      <footer className="mt-20 w-full border-t border-stone-200 bg-white transition-colors duration-300 dark:border-stone-800 dark:bg-[#121212] sm:mt-24">
        <div className="container mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-4 py-10 text-center text-sm font-light text-stone-500 dark:text-stone-400 sm:gap-6 sm:px-6 sm:py-12 md:flex-row md:justify-between md:px-16 md:text-left">
          <p className="max-w-[20rem] md:max-w-none">
            © {new Date().getFullYear()} Sona. {content.footer.license}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-medium md:justify-end">
            <Link
              href="https://github.com/AirSodaz/sona"
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {content.footer.repo}
            </Link>
            <Link
              href="https://github.com/AirSodaz/sona/issues"
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {content.footer.issue}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 transition-colors duration-300 dark:bg-stone-800/50">
        {icon}
      </div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:tracking-widest">
        {title}
      </h3>
      <p className="text-sm font-light leading-7 text-stone-600 transition-colors duration-300 dark:text-stone-400">
        {description}
      </p>
    </div>
  );
}

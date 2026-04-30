'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Github, Mic, Shield, Bot, Scissors, Globe } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { DownloadButton } from '@/components/download-button';
import { ScrollHint } from '@/components/scroll-hint';
import { UseCasesSection } from '@/components/use-cases-section';
import { TranscriptDemo } from '@/components/transcript-demo';
import { downloadContent } from '@/lib/download-content';
import type { HomeLocale, HomePageContent } from '@/lib/homepage-content';
import { motion } from 'motion/react';

export function HomePage({
  content,
  locale,
}: {
  content: HomePageContent;
  locale: HomeLocale;
}) {
  const demoPreviewId = 'homepage-demo-preview';
  const downloads = downloadContent[locale];

  return (
    <div className="relative overflow-hidden bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0]">
      <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[500px] sm:w-[500px] sm:blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[600px] sm:w-[600px] sm:blur-[120px]"></div>

      <section className="relative flex min-h-[100svh] flex-col">
        <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-5 sm:px-6 sm:py-7 md:px-16 md:py-8">
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
              className="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-stone-800 focus:outline-none dark:hover:text-stone-200"
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

        <div className="flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-[1400px] px-4 pb-22 pt-0 sm:px-6 sm:pb-24 sm:pt-3 md:px-16 md:pb-28 md:pt-4">
            <motion.div
              className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:mb-6 sm:text-xs sm:tracking-[0.28em]"
              >
                {content.hero.badge}
              </motion.p>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mb-3 text-[clamp(2.7rem,12vw,4.5rem)] leading-[0.94] font-serif italic text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] sm:mb-4 sm:text-6xl md:text-7xl"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {content.hero.title1} <br />
                <span className="font-light text-stone-500 transition-colors duration-300 dark:text-stone-400">
                  {content.hero.title2}
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mx-auto mb-6 max-w-2xl text-[1rem] font-light leading-[1.75] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:mb-8 sm:text-lg sm:leading-[1.8]"
              >
                {content.hero.desc}
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-start sm:gap-4"
              >
                <DownloadButton
                  content={downloads}
                  text={content.hero.btnDownload}
                />
                <Link
                  href={content.hero.docsHref}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-[#2D2D2D] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-white dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:shadow-white/5 sm:w-auto sm:px-8"
                >
                  {content.hero.btnDocs}
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mt-8 w-full max-w-3xl border-t border-stone-200/80 pt-5 text-left transition-colors duration-300 dark:border-stone-800/80 sm:mt-9 sm:pt-6"
              >
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-[11px]">
                  {content.hero.workflowLabel}
                </p>

                <ol className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-0">
                  {content.hero.workflowSteps.map((step, index) => (
                    <li
                      key={step}
                      className="flex min-w-0 items-center gap-3 sm:flex-none"
                    >
                      <span className="font-mono text-[10px] tracking-[0.24em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-[11px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm leading-6 text-stone-600 transition-colors duration-300 dark:text-stone-300 sm:text-[0.95rem]">
                        {step}
                      </span>
                      {index < content.hero.workflowSteps.length - 1 ? (
                        <span className="hidden h-px w-8 bg-stone-200 transition-colors duration-300 dark:bg-stone-700 sm:block md:w-10" />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <ScrollHint label={content.hero.scrollHint} targetId={demoPreviewId} />
      </section>

      <main className="w-full pb-10 pt-6 sm:pb-12 sm:pt-10 md:pt-12">
        <section
          id={demoPreviewId}
          className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 scroll-mt-6 sm:scroll-mt-8"
        >
          <div className="relative overflow-hidden bg-[#191513] py-16 text-white sm:py-20 lg:py-24 dark:bg-[#080808]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0)_38%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(25,21,19,0),rgba(25,21,19,0.38))] dark:bg-[linear-gradient(180deg,rgba(8,8,8,0),rgba(8,8,8,0.52))]" />
            <div className="pointer-events-none absolute left-1/2 top-12 h-52 w-[min(82vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(199,144,110,0.22),rgba(199,144,110,0))] blur-3xl dark:bg-[radial-gradient(circle,rgba(199,144,110,0.12),rgba(199,144,110,0))]" />

            <div className="relative mx-auto w-full max-w-[1520px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
              <TranscriptDemo demo={content.demo} />
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 md:px-16">
          <div className="mt-8 w-full sm:mt-10">
            <UseCasesSection content={content.useCases} />
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

          <ClosingCtaSection
            content={content.finalCta}
            primaryHref={downloads.button.allBuildsHref}
          />
        </div>
      </main>

      <footer className="w-full border-t border-stone-200 bg-white transition-colors duration-300 dark:border-stone-800 dark:bg-[#121212]">
        <div className="container mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-4 py-10 text-center text-sm font-light text-stone-500 dark:text-stone-400 sm:gap-6 sm:px-6 sm:py-12 md:flex-row md:justify-between md:px-16 md:text-left">
          <p className="max-w-[20rem] md:max-w-none">
            © {new Date().getFullYear()} Sona. {content.footer.license}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-medium md:justify-end">
            <Link
              href={content.footer.trustHref}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              {content.footer.trust}
            </Link>
            <Link
              href={content.footer.privacyHref}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              {content.footer.privacy}
            </Link>
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

function ClosingCtaSection({
  content,
  primaryHref,
}: {
  content: HomePageContent['finalCta'];
  primaryHref: string;
}) {
  return (
    <motion.section
      className="mx-auto mt-20 w-full max-w-5xl sm:mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-white/72 px-6 py-8 text-center shadow-[0_30px_90px_-60px_rgba(87,83,78,0.58)] backdrop-blur-xl transition-colors duration-300 dark:border-stone-800/80 dark:bg-stone-900/72 dark:shadow-[0_28px_90px_-62px_rgba(0,0,0,0.76)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-24 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent blur-3xl dark:via-stone-700/35" />
        <div className="pointer-events-none absolute left-1/2 top-full h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-200/60 blur-3xl dark:bg-stone-700/25" />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-xs">
            {content.eyebrow}
          </p>
          <h2
            className="mt-4 text-[2rem] leading-tight text-stone-800 transition-colors duration-300 dark:text-stone-100 sm:text-[2.35rem] md:text-[2.65rem]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 font-light text-stone-600 transition-colors duration-300 dark:text-stone-300 sm:text-lg">
            {content.desc}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
            <Link
              href={primaryHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-center text-sm font-medium leading-tight text-white shadow-lg shadow-stone-200 transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:shadow-none dark:hover:bg-white sm:min-w-[18rem] sm:w-auto sm:px-8"
            >
              {content.primaryLabel}
            </Link>
            <Link
              href={content.secondaryHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-[#2D2D2D] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:shadow-white/5 sm:w-auto sm:px-8"
            >
              {content.secondaryLabel}
            </Link>
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-500 transition-colors duration-300 dark:text-stone-400">
            {content.note}
          </p>
        </div>
      </div>
    </motion.section>
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
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 transition-colors duration-300 dark:bg-stone-800/50">
        {icon}
      </div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:tracking-widest">
        {title}
      </h3>
      <p className="text-sm font-light leading-7 text-stone-600 transition-colors duration-300 dark:text-stone-400">
        {description}
      </p>
    </motion.div>
  );
}

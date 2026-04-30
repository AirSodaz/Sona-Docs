import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import type { TrustPrivacyPageCopy } from '@/lib/trust-privacy-content';

export function TrustPrivacyPage({
  content,
}: {
  content: TrustPrivacyPageCopy;
}) {
  const HeroIcon = content.id === 'trust' ? ShieldCheck : LockKeyhole;
  const isChinese = content.locale === 'zh-CN';
  const heroGridClass = isChinese
    ? 'lg:grid-cols-[1fr_1fr]'
    : 'lg:grid-cols-[0.78fr_1.22fr]';
  const heroTitleClass = isChinese
    ? 'mt-4 max-w-2xl whitespace-pre-line text-[clamp(2.4rem,9vw,3.65rem)] font-medium leading-[1.08] text-stone-900 dark:text-stone-100'
    : 'mt-4 max-w-2xl whitespace-pre-line text-[clamp(2.7rem,9vw,5.25rem)] leading-[0.95] text-stone-900 dark:text-stone-100';
  const heroTitleFont = isChinese
    ? 'var(--font-sans)'
    : 'var(--font-serif)';

  return (
    <main className="min-h-[100svh] bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-5 sm:px-6 sm:py-7 md:px-16 md:py-8">
        <header className="flex flex-col gap-6 border-b border-stone-200/70 pb-6 dark:border-stone-800/70 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={content.nav.homeHref}
            className="group flex w-fit items-center transition-colors focus:outline-none"
            aria-label={content.nav.homeLabel}
          >
            <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
              <Logo className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
              <span
                className="-ml-1 mt-0.5 text-[1.55rem] italic tracking-tighter text-[#5c4d43] dark:text-[#E0E0E0] sm:text-[1.7rem]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ona
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-stone-500 dark:text-stone-400 sm:gap-6 sm:text-sm md:gap-8">
            <ThemeToggle />
            <HeaderLink href={content.nav.homeHref}>
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">{content.nav.homeLabel}</span>
            </HeaderLink>
            <HeaderLink href={content.nav.alternateHref}>
              <Globe size={16} />
              <span className="hidden sm:inline">
                {content.nav.alternateLanguageLabel}
              </span>
              <span className="sm:hidden">
                {content.nav.alternateLanguageShortLabel}
              </span>
            </HeaderLink>
            <HeaderLink href="https://github.com/AirSodaz/sona" external>
              <Github size={16} />
              <span className="hidden sm:inline">{content.nav.githubLabel}</span>
            </HeaderLink>
          </div>
        </header>

        <article className="mx-auto w-full max-w-5xl py-14 sm:py-16 lg:py-20">
          <section
            className={`grid gap-8 border-b border-stone-200/70 pb-12 dark:border-stone-800/70 ${heroGridClass} lg:items-end`}
          >
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-white/70 text-stone-600 shadow-sm dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300">
                <HeroIcon size={20} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500 sm:text-xs">
                {content.hero.eyebrow}
              </p>
              <h1
                className={heroTitleClass}
                style={{ fontFamily: heroTitleFont }}
              >
                {content.hero.title}
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500 sm:text-xs">
                {content.hero.updatedLabel}
              </p>
              <p className="mt-4 text-base font-light leading-8 text-stone-600 dark:text-stone-300 sm:text-lg sm:leading-9">
                {content.hero.description}
              </p>
            </div>
          </section>

          <section className="grid gap-4 py-10 sm:grid-cols-3 sm:gap-5">
            {content.facts.map((fact) => (
              <div
                key={fact.title}
                className="rounded-lg border border-stone-200/80 bg-white/55 p-5 shadow-[0_18px_55px_-45px_rgba(87,83,78,0.5)] transition-colors dark:border-stone-800/80 dark:bg-stone-900/45 dark:shadow-none"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  {fact.label}
                </p>
                <h2 className="mt-3 text-base font-medium leading-6 text-stone-900 dark:text-stone-100">
                  {fact.title}
                </h2>
                <p className="mt-3 text-sm font-light leading-7 text-stone-600 dark:text-stone-400">
                  {fact.description}
                </p>
              </div>
            ))}
          </section>

          <div className="divide-y divide-stone-200/80 border-y border-stone-200/80 dark:divide-stone-800/80 dark:border-stone-800/80">
            {content.sections.map((section, index) => (
              <section
                key={section.title}
                className="grid gap-7 py-10 sm:py-12 lg:grid-cols-[0.35fr_1fr]"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                    {section.eyebrow}
                  </p>
                </div>
                <div className="max-w-3xl">
                  <h2
                    className="text-[1.65rem] leading-tight text-stone-900 dark:text-stone-100 sm:text-[2rem]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base font-light leading-8 text-stone-600 dark:text-stone-300">
                    {section.body}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-400">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400 dark:bg-stone-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-lg border border-stone-200/80 bg-white/58 p-6 text-center shadow-[0_22px_70px_-54px_rgba(87,83,78,0.55)] dark:border-stone-800/80 dark:bg-stone-900/48 dark:shadow-none sm:p-8">
            <h2
              className="text-[2rem] leading-tight text-stone-900 dark:text-stone-100 sm:text-[2.35rem]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {content.closing.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-8 text-stone-600 dark:text-stone-300">
              {content.closing.description}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={content.closing.primaryHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-stone-800 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white sm:w-auto"
              >
                {content.closing.primaryLabel}
              </Link>
              <Link
                href={content.closing.secondaryHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-white dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 sm:w-auto"
              >
                {content.closing.secondaryLabel}
              </Link>
            </div>
          </section>
        </article>

        <footer className="flex flex-col items-center gap-5 border-t border-stone-200/70 py-8 text-center text-sm font-light text-stone-500 dark:border-stone-800/70 dark:text-stone-400 md:flex-row md:justify-between md:text-left">
          <p className="max-w-[20rem] md:max-w-none">
            © {new Date().getFullYear()} Sona. {content.footer.license}
          </p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 font-medium md:justify-end">
            <Link
              href={content.footer.trustHref}
              className="transition-colors hover:text-stone-800 dark:hover:text-stone-200"
            >
              {content.footer.trustLabel}
            </Link>
            <Link
              href={content.footer.privacyHref}
              className="transition-colors hover:text-stone-800 dark:hover:text-stone-200"
            >
              {content.footer.privacyLabel}
            </Link>
            <a
              href="https://github.com/AirSodaz/sona"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-stone-800 dark:hover:text-stone-200"
            >
              {content.nav.githubLabel}
              <ExternalLink size={13} />
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function HeaderLink({
  children,
  external = false,
  href,
}: {
  children: ReactNode;
  external?: boolean;
  href: string;
}) {
  const className =
    'inline-flex items-center gap-1.5 transition-colors hover:text-stone-800 focus:outline-none dark:hover:text-stone-200';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

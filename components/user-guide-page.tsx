import type { ReactNode } from 'react';
import Link from 'next/link';
import { Github, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { userGuidePageContent, getUserGuideMarkdown, resolveUserGuideHref } from '@/lib/user-guide-content';
import type { HomeLocale } from '@/lib/homepage-content';

function createMarkdownComponents(): Components {
  return {
    h1: ({ children }) => (
      <h1
        className="text-[2.5rem] leading-[0.98] text-stone-900 dark:text-stone-100 sm:text-[3.25rem]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-12 scroll-mt-24 border-t border-stone-200 pt-8 text-[1.9rem] leading-tight text-stone-900 dark:border-stone-800 dark:text-stone-100 sm:text-[2.2rem]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-lg font-semibold tracking-[0.02em] text-stone-900 dark:text-stone-100 sm:text-xl">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-[1.05rem]">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="space-y-3 pl-6 text-base leading-8 text-stone-600 marker:text-stone-400 dark:text-stone-300 dark:marker:text-stone-500 sm:text-[1.05rem]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-3 pl-6 text-base leading-8 text-stone-600 marker:font-medium marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400 sm:text-[1.05rem]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    a: ({ href, children }) => {
      const resolved = resolveUserGuideHref(href);
      const className =
        'font-medium text-stone-900 underline decoration-stone-300 decoration-2 underline-offset-4 transition-colors hover:text-stone-600 hover:decoration-stone-500 dark:text-stone-100 dark:decoration-stone-600 dark:hover:text-stone-300';

      if (resolved.external) {
        return (
          <a
            href={resolved.href}
            target="_blank"
            rel="noreferrer"
            className={className}
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={resolved.href} className={className}>
          {children}
        </Link>
      );
    },
    code: ({ children }) => (
      <code className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[0.95em] text-stone-800 dark:bg-stone-800 dark:text-stone-100">
        {children}
      </code>
    ),
  };
}

function HeaderLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    'inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-900';

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
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

export async function UserGuidePage({ locale }: { locale: HomeLocale }) {
  const config = userGuidePageContent[locale];
  const markdown = await getUserGuideMarkdown(locale);
  const markdownComponents = createMarkdownComponents();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-16">
      <div className="absolute right-0 top-0 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200/70 blur-[90px] dark:bg-stone-800/40 sm:h-[480px] sm:w-[480px] sm:blur-[110px]" />
      <div className="absolute bottom-0 left-0 h-[340px] w-[340px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200/70 blur-[100px] dark:bg-stone-800/30 sm:h-[560px] sm:w-[560px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        <header className="flex flex-col gap-5 rounded-[28px] border border-stone-200/80 bg-white/78 px-5 py-5 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/78 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                href={config.homeHref}
                className="inline-flex items-center gap-3 text-stone-900 transition-colors hover:text-stone-600 dark:text-stone-100 dark:hover:text-stone-300"
              >
                <Logo className="h-10 w-10 rounded-xl" />
                <div>
                  <p
                    className="text-[1.8rem] italic leading-none"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Sona
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {config.headerLabel}
                  </p>
                </div>
              </Link>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-base">
                {config.headerDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <HeaderLink href={config.homeHref}>
                <span className="inline-flex items-center gap-2">
                  <Home size={16} />
                  {config.homeLabel}
                </span>
              </HeaderLink>
              <HeaderLink href={config.alternatePath}>
                {config.alternateLabel}
              </HeaderLink>
              <HeaderLink href={config.sourceHref} external>
                <span className="inline-flex items-center gap-2">
                  <Github size={16} />
                  {config.sourceLabel}
                </span>
              </HeaderLink>
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
          <article className="space-y-6">
            <ReactMarkdown components={markdownComponents}>
              {markdown}
            </ReactMarkdown>
          </article>
        </section>
      </div>
    </main>
  );
}

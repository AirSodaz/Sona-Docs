import Link from 'next/link';
import './globals.css';
import { Logo } from '@/components/Logo';
import { cormorantGaramond, inter } from '@/lib/fonts';

export const metadata = {
  title: '404 | Sona',
  description: 'The requested page could not be found.',
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable}`}
    >
      <body className="min-h-screen bg-[#F7F5F2] text-[#2D2D2D] antialiased">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
          <div className="absolute right-0 top-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200/80 blur-[90px] sm:h-[420px] sm:w-[420px] sm:blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200/80 blur-[100px] sm:h-[520px] sm:w-[520px] sm:blur-[120px]" />

          <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-stone-200/80 bg-white/88 p-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl sm:rounded-[32px] sm:p-12">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9 rounded-xl sm:h-10 sm:w-10" />
              <div>
                <p
                  className="text-[1.75rem] italic text-[#5C4D43] sm:text-2xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Sona
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 sm:text-xs sm:tracking-[0.24em]">
                  Offline Transcript Editor
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5 sm:mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.32em]">
                404
              </p>
              <h1
                className="text-[2.75rem] leading-[0.98] text-stone-900 sm:text-5xl"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                This page drifted out of the transcript.
              </h1>
              <p className="text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                The page you requested does not exist, or the link has moved.
                Start from the English landing page, jump to the Chinese page,
                or head back to the repository.
              </p>
              <p className="text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                你访问的页面不存在，或者链接已经变更。你可以返回英文首页、切换到中文页面，或直接前往 GitHub 仓库继续查看。
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 sm:min-h-0"
              >
                Back to /
              </Link>
              <Link
                href="/zh"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 sm:min-h-0"
              >
                前往 /zh
              </Link>
              <a
                href="https://github.com/AirSodaz/sona"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 sm:min-h-0"
              >
                View Repository
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

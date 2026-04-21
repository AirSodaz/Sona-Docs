import type { ReactNode } from 'react';
import Link from 'next/link';
import { Github, Mic, Shield, Bot, Scissors, Globe } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { DownloadButton } from '@/components/download-button';
import { TranscriptDemo } from '@/components/transcript-demo';
import type { HomePageContent } from '@/lib/homepage-content';

export function HomePage({ content }: { content: HomePageContent }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#F7F5F2] text-[#2D2D2D] dark:bg-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200 dark:bg-stone-800 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-30 dark:opacity-20 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-200 dark:bg-stone-800 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4 opacity-30 dark:opacity-20 transition-colors duration-300"></div>

      <header className="flex justify-between items-center px-6 md:px-16 py-8 w-full max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <Logo className="w-8 h-8 rounded-lg" />
          <span
            className="text-[1.7rem] font-serif italic tracking-tighter mt-0.5 text-[#5c4d43] dark:text-[#E0E0E0] -ml-1"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ona
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-6 md:gap-8 text-sm font-medium text-stone-500 dark:text-stone-400"
        >
          <ThemeToggle />
          <Link
            href={content.nav.languageToggleHref}
            className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{content.nav.languageToggleLabel}</span>
            <span className="sm:hidden">{content.nav.languageToggleShortLabel}</span>
          </Link>
          <Link
            href="https://github.com/AirSodaz/sona"
            className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center gap-2"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            <span className="hidden sm:inline">{content.nav.github}</span>
          </Link>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 md:px-16 w-full mt-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-8 shadow-sm transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 dark:bg-stone-500 opacity-30"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-400 dark:bg-stone-500"></span>
            </span>
            {content.hero.badge}
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-serif italic mb-6 leading-tight text-[#2D2D2D] dark:text-[#E0E0E0] transition-colors duration-300"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {content.hero.title1} <br />
            <span className="text-stone-500 dark:text-stone-400 font-light transition-colors duration-300">
              {content.hero.title2}
            </span>
          </h1>

          <p className="text-lg text-stone-500 dark:text-stone-400 mb-10 leading-relaxed font-light max-w-2xl mx-auto transition-colors duration-300">
            {content.hero.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <DownloadButton text={content.hero.btnDownload} />
            <Link href={content.hero.docsHref} target="_blank" rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-[#2D2D2D] dark:text-stone-300 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                {content.hero.btnDocs}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full mt-2"
        >
          <TranscriptDemo demo={content.demo} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="grid sm:grid-cols-2 gap-12 mt-20 text-left w-full max-w-4xl mx-auto"
        >
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
        </motion.div>
      </main>

      <footer className="w-full mt-24 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="container mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center text-sm font-light text-stone-500 dark:text-stone-400 max-w-[1400px] gap-6">
          <p>
            © {new Date().getFullYear()} Sona. {content.footer.license}
          </p>
          <div className="flex gap-10 font-medium">
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
      <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800/50 flex items-center justify-center mb-4 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 font-light leading-snug transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

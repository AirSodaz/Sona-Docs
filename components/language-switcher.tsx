'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh-CN', label: '简体中文', short: '中' },
  { code: 'ja', label: '日本語', short: '日' },
] as const;

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 cursor-pointer rounded-xl px-2 py-1 text-[13px] font-medium text-stone-500 hover:text-stone-800 focus:outline-none dark:text-stone-400 dark:hover:text-stone-200 transition-colors select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.short}</span>
        <ChevronDown
          size={14}
          className={`opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-stone-200/80 bg-white/95 p-1.5 shadow-[0_18px_54px_-44px_rgba(87,83,78,0.5)] backdrop-blur-md dark:border-stone-800/80 dark:bg-[#171717]/95 dark:shadow-[0_18px_54px_-44px_rgba(0,0,0,0.72)] z-50"
          >
            <div className="flex flex-col gap-0.5" role="menu" aria-orientation="vertical">
              {LANGUAGES.map((lang) => {
                const isActive = lang.code === currentLocale;
                return (
                  <Link
                    key={lang.code}
                    href={pathname}
                    locale={lang.code}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl transition-all ${
                      isActive
                        ? 'bg-stone-100 text-stone-900 font-medium dark:bg-stone-800/80 dark:text-white'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/50 dark:hover:text-stone-200'
                    }`}
                    role="menuitem"
                  >
                    <span>{lang.label}</span>
                    {isActive && <Check size={13} className="opacity-80" />}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

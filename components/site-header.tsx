'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface SiteHeaderProps {
  children: ReactNode;
}

export function SiteHeader({ children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'border-stone-200/50 bg-[#F7F5F2]/80 backdrop-blur-md shadow-sm shadow-stone-200/5 dark:border-stone-800/50 dark:bg-[#121212]/80 dark:shadow-none'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 md:px-16 transition-all duration-300">
        {children}
      </div>
    </header>
  );
}

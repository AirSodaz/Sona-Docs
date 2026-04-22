'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const STORAGE_KEY = 'sona-homepage-scroll-hint-dismissed';

function persistDismissedState() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Ignore storage failures and keep the hint ephemeral.
  }
}

function hasDismissedState() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function ScrollHint({
  label,
  targetId,
}: {
  label: string;
  targetId: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.scrollY > 20 || hasDismissedState()) {
      return;
    }

    const revealId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const dismiss = () => {
      persistDismissedState();
      setIsVisible(false);
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        dismiss();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(revealId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismiss = () => {
    persistDismissedState();
    setIsVisible(false);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    dismiss();

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 8 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, 6, 0] }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.28, ease: 'easeOut' }
          : {
              opacity: { duration: 0.28, ease: 'easeOut' },
              y: { duration: 2.1, ease: 'easeInOut', repeat: Infinity },
            }
      }
      className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit flex-col items-center gap-1.5 text-stone-400 transition-colors hover:text-stone-700 focus:outline-none focus-visible:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 dark:focus-visible:text-stone-200 sm:bottom-7"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px]">
        {label}
      </span>
      <ArrowDown size={15} strokeWidth={1.8} />
    </motion.a>
  );
}

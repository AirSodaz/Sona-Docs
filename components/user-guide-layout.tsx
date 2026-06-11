'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { PanelLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/Logo';
import { SiteHeader } from '@/components/site-header';
import type { UserGuidePageModel, UserGuideNavGroup } from '@/lib/user-guide-content';

interface UserGuideLayoutProps {
  children: ReactNode;
  page: UserGuidePageModel;
  navigation: UserGuideNavGroup[];
  searchBar: ReactNode;
  headerActionsMobile: ReactNode;
  headerActionsDesktop: ReactNode;
}

export function UserGuideLayout({
  children,
  page,
  navigation,
  searchBar,
  headerActionsMobile,
  headerActionsDesktop,
}: UserGuideLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Store page.id to track changes during rendering
  const [prevPageId, setPrevPageId] = useState(page.id);
  if (page.id !== prevPageId) {
    setPrevPageId(page.id);
    setIsMobileOpen(false);
  }

  // Read collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sona-docs-sidebar-collapsed');
    requestAnimationFrame(() => {
      setIsMounted(true);
      if (stored !== null) {
        setIsSidebarCollapsed(stored === 'true');
      }
    });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sona-docs-sidebar-collapsed', String(next));
      return next;
    });
  };

  const renderLogo = () => (
    <Link
      href={page.homeHref}
      className="group flex items-center transition-colors focus:outline-none"
    >
      <div className="flex origin-left items-center transition-transform duration-300 will-change-transform group-hover:scale-105">
        <Logo className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
        <span
          className="-ml-1 mt-0.5 text-[1.55rem] font-serif italic tracking-tighter text-[#5c4d43] dark:text-[#E0E0E0] sm:text-[1.7rem]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ona
        </span>
      </div>
    </Link>
  );

  const renderNavGroups = () => (
    <div className="space-y-8">
      {navigation.map((group) => (
        <div key={group.id}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400/80 dark:text-stone-500/80">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`group block rounded-xl px-3 py-2 transition-all ${
                  item.active
                    ? 'bg-stone-200/50 text-[#2D2D2D] dark:bg-stone-800/50 dark:text-[#E0E0E0]'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-900/50 dark:hover:text-stone-200'
                }`}
              >
                <p className={`text-sm ${item.active ? 'font-medium' : 'font-normal'}`}>{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="relative min-h-[100svh] bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0]">
      {/* Background Blobs Wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[600px] sm:w-[600px] sm:blur-[120px]" />
      </div>

      {/* Responsive Sticky Header */}
      <SiteHeader>
        <div className="grid gap-4 lg:grid-cols-[auto_minmax(18rem,32rem)_auto] lg:items-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-xl text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200 transition-all cursor-pointer"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <PanelLeft size={20} className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180 text-stone-400' : ''}`} />
              </button>

              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200 transition-all cursor-pointer"
                aria-label="Open navigation menu"
              >
                <PanelLeft size={20} />
              </button>

              {renderLogo()}
            </div>
            {headerActionsMobile}
          </div>

          {searchBar}

          {headerActionsDesktop}
        </div>
      </SiteHeader>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-start pb-20">
          {/* Desktop Sidebar (Collapsible with width animation and overflow control to prevent reflow) */}
          <aside
            className={`hidden lg:block shrink-0 overflow-hidden ${
              isMounted ? 'transition-all duration-300 ease-in-out' : ''
            } ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 pointer-events-none pr-0'
                : 'w-[344px] opacity-100 pr-16'
            }`}
          >
            <div className="w-[280px]">
              <div className="sticky top-[108px] flex flex-col gap-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                  {page.sidebarTitle}
                </p>
                {renderNavGroups()}
              </div>
            </div>
          </aside>

          {/* Main Content Pane (Expands when sidebar collapses) */}
          <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
            <div
              className={`mx-auto transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'max-w-5xl lg:mx-auto' : 'max-w-4xl lg:mx-0'
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide-over overlay using Framer Motion) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#F7F5F2] dark:bg-[#121212] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                {renderLogo()}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500 mb-6">
                  {page.sidebarTitle}
                </p>
                {renderNavGroups()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

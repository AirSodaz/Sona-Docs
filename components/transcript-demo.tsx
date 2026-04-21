'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock3,
  Languages,
  Mic,
  Shield,
  Sparkles,
} from 'lucide-react';
import type {
  DemoAction,
  DemoContent,
  DemoPanelContent,
} from '@/lib/homepage-content';

const actionOrder: DemoAction[] = ['recorded', 'polished', 'translated'];

const actionIcons = {
  recorded: Mic,
  polished: Sparkles,
  translated: Languages,
} as const;

export function TranscriptDemo({ demo }: { demo: DemoContent }) {
  const [activeAction, setActiveAction] = useState<DemoAction>('recorded');
  const activePanel = demo.panels[activeAction];

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-stone-500">
          {demo.eyebrow}
        </p>
        <h2
          className="mt-4 text-3xl sm:text-4xl md:text-[2.8rem] leading-tight text-[#2D2D2D] dark:text-[#E0E0E0]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {demo.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-stone-500 dark:text-stone-400 font-light leading-relaxed">
          {demo.desc}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 dark:border-stone-800/80 bg-white/75 dark:bg-stone-900/75 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] dark:shadow-[0_28px_90px_-52px_rgba(0,0,0,0.72)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-24 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent dark:via-stone-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-16 h-40 w-40 rounded-full bg-stone-200/70 dark:bg-stone-700/30 blur-3xl" />

        <div className="border-b border-stone-200/80 dark:border-stone-800/80 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center gap-1.5 pt-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
              </div>

              <div className="space-y-1 text-left">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500">
                  {demo.appLabel}
                </p>
                <p className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-100">
                  {demo.fileName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                icon={<CheckCircle2 size={14} />}
                label={demo.status}
              />
              <StatusPill icon={<Clock3 size={14} />} label={demo.duration} />
              <StatusPill icon={<Shield size={14} />} label={demo.localBadge} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.88fr)]">
          <div className="rounded-[28px] border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/75 dark:bg-[#171717] p-4 sm:p-5">
            <div className="border-b border-stone-200/70 dark:border-stone-800/70 pb-4">
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500">
                  {demo.transcriptLabel}
                </p>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {demo.transcriptHint}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {demo.segments.map((segment, index) => (
                <motion.div
                  key={`${segment.time}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: index * 0.04 }}
                  className="flex items-start gap-3 rounded-[22px] border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/70 px-3 py-3.5 sm:px-4"
                >
                  <span className="shrink-0 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-800/80 px-2.5 py-1 font-mono text-[11px] tracking-[0.18em] text-stone-500 dark:text-stone-300">
                    {segment.time}
                  </span>
                  <p className="text-sm sm:text-[0.95rem] leading-7 text-stone-700 dark:text-stone-200">
                    {segment.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#151515] p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {actionOrder.map((action) => {
                const Icon = actionIcons[action];
                const isActive = activeAction === action;

                return (
                  <button
                    key={action}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveAction(action)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#151515] ${
                      isActive
                        ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
                        : 'border-stone-200 bg-stone-50/80 text-stone-600 hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:bg-stone-900'
                    }`}
                  >
                    <Icon size={15} />
                    {demo.controls[action]}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 min-h-[340px] rounded-[24px] border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/50 p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAction}
                  initial={{ opacity: 0, x: 12, y: 6 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -12, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="h-full"
                >
                  <PanelContent panel={activePanel} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelContent({ panel }: { panel: DemoPanelContent }) {
  return (
    <div className="flex h-full flex-col text-left">
      <span className="inline-flex w-fit items-center rounded-full border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
        {panel.badge}
      </span>

      <h3
        className="mt-4 text-2xl leading-tight text-stone-800 dark:text-stone-100"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {panel.title}
      </h3>

      <div className="mt-4 space-y-4">
        {panel.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm sm:text-[0.95rem] leading-7 text-stone-600 dark:text-stone-300"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {panel.highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[18px] border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/55 px-3 py-3 text-sm text-stone-600 dark:text-stone-300"
          >
            {highlight}
          </div>
        ))}
      </div>

      <p className="mt-auto pt-6 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
        {panel.note}
      </p>
    </div>
  );
}

function StatusPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/55 px-3 py-1.5 text-xs text-stone-500 dark:text-stone-300">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

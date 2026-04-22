'use client';

import { motion } from 'motion/react';
import {
  Briefcase,
  Film,
  GraduationCap,
  Languages,
  type LucideIcon,
} from 'lucide-react';
import type {
  UseCaseId,
  UseCaseItem,
  UseCasesContent,
} from '@/lib/homepage-content';

const useCaseIcons: Record<UseCaseId, LucideIcon> = {
  meetings: Briefcase,
  lectures: GraduationCap,
  'subtitle-export': Film,
  'subtitle-translation': Languages,
};

export function UseCasesSection({
  content,
}: {
  content: UseCasesContent;
}) {
  return (
    <section className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 1, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.45 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-stone-500">
          {content.eyebrow}
        </p>
        <h2
          className="mt-4 text-3xl sm:text-4xl md:text-[2.8rem] leading-tight text-[#2D2D2D] dark:text-[#E0E0E0]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {content.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-stone-500 dark:text-stone-400 font-light leading-relaxed">
          {content.desc}
        </p>
      </motion.div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#F7F5F2] to-transparent dark:from-[#121212] md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#F7F5F2] to-transparent dark:from-[#121212] md:hidden" />

        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:auto-rows-fr md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 xl:grid-cols-4 xl:gap-4">
          {content.items.map((item, index) => (
            <UseCaseStory
              key={item.id}
              item={item}
              index={index}
              labels={content.labels}
            />
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 1, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: 'easeOut', delay: 0.08 }}
        viewport={{ once: true, amount: 0.7 }}
        className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-stone-500 dark:text-stone-400"
      >
        {content.note}
      </motion.p>
    </section>
  );
}

function UseCaseStory({
  item,
  index,
  labels,
}: {
  item: UseCaseItem;
  index: number;
  labels: UseCasesContent['labels'];
}) {
  const Icon = useCaseIcons[item.id];

  return (
    <motion.article
      initial={{ opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: 'easeOut',
        delay: index * 0.06,
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative flex h-full min-w-[284px] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/75 p-5 shadow-[0_28px_70px_-52px_rgba(87,83,78,0.6)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/70 dark:shadow-[0_24px_72px_-48px_rgba(0,0,0,0.72)] md:min-w-0 md:max-w-none md:p-6"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-20 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent blur-3xl dark:via-stone-700/35" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/80 bg-stone-100/85 text-stone-600 dark:border-stone-700/80 dark:bg-stone-800/75 dark:text-stone-300">
            <Icon size={18} />
          </div>
          <h3
            className="mt-5 text-[1.65rem] leading-tight text-stone-800 dark:text-stone-100"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {item.title}
          </h3>
        </div>

        <span className="pt-1 font-mono text-[11px] tracking-[0.28em] text-stone-300 dark:text-stone-600">
          0{index + 1}
        </span>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stone-200/80 bg-stone-50/85 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-stone-500 dark:border-stone-800/80 dark:bg-stone-950/55 dark:text-stone-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-6 flex flex-1 flex-col">
        <StoryRow label={labels.context} value={item.context} />
        <StoryRow label={labels.workflow} value={item.workflow} />
        <StoryRow label={labels.result} value={item.result} />
      </div>
    </motion.article>
  );
}

function StoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-stone-200/80 py-4 first:border-t-0 first:pt-0 dark:border-stone-800/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
        {value}
      </p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface UserGuideCodeBlockProps {
  code: string;
  copyLabel: string;
  copiedLabel: string;
}

async function copyCodeToClipboard(code: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      // Fall through to the legacy copy path when clipboard permissions fail.
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.append(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const copied = document.execCommand('copy');
    textArea.remove();
    return copied;
  } catch {
    return false;
  }
}

export function UserGuideCodeBlock({
  code,
  copyLabel,
  copiedLabel,
}: UserGuideCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  const label = copied ? copiedLabel : copyLabel;

  const handleCopy = async () => {
    const didCopy = await copyCodeToClipboard(code);

    if (didCopy) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-[1.75rem] border border-stone-800/80 bg-[#211d1b] shadow-[0_20px_60px_rgba(24,21,18,0.18)] transition-colors dark:border-stone-700 dark:bg-[#161312] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-end border-b border-white/10 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={label}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-stone-200 transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#211d1b] dark:text-stone-100 dark:hover:border-white/20 dark:hover:bg-white/10 dark:focus-visible:ring-stone-400/70 dark:focus-visible:ring-offset-[#161312]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{label}</span>
        </button>
      </div>

      <div className="overflow-x-auto px-4 py-4 sm:px-6 sm:py-5">
        <pre className="m-0 bg-transparent p-0 text-[0.95rem] leading-7 text-stone-100 sm:text-[0.98rem]">
          <code className="block w-max min-w-full bg-transparent p-0 font-mono text-inherit">
            {code}
          </code>
        </pre>
      </div>

      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </div>
  );
}

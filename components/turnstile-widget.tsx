'use client';

import { useEffect, useRef, useState } from 'react';

type TurnstileRenderOptions = {
  action?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  sitekey: string;
  size?: 'flexible' | 'normal';
  theme?: 'auto' | 'dark' | 'light';
};

type TurnstileApi = {
  remove?: (widgetId: string) => void;
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Turnstile can only load in the browser.'));
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true' || window.turnstile) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => {
          turnstileScriptPromise = null;
          reject(new Error('Failed to load Turnstile script.'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error('Failed to load Turnstile script.'));
    };

    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

export function TurnstileWidget({
  action,
  onError,
  onExpire,
  onToken,
  siteKey,
}: {
  action: string;
  onError: () => void;
  onExpire: () => void;
  onToken: (token: string) => void;
  siteKey: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isActive = true;

    loadTurnstileScript()
      .then(() => {
        if (!isActive || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          action,
          callback: (token) => {
            if (isActive) {
              onToken(token);
            }
          },
          'error-callback': () => {
            if (isActive) {
              onError();
            }
          },
          'expired-callback': () => {
            if (isActive) {
              onExpire();
            }
          },
          'timeout-callback': () => {
            if (isActive) {
              onExpire();
            }
          },
          sitekey: siteKey,
          size: 'flexible',
          theme: 'auto',
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setLoadFailed(true);
        onError();
      });

    return () => {
      isActive = false;

      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [action, onError, onExpire, onToken, siteKey]);

  return loadFailed ? null : <div ref={containerRef} className="min-h-16" />;
}

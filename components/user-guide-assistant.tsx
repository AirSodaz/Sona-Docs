'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { TurnstileWidget } from '@/components/turnstile-widget';

const MAX_QUESTION_LENGTH = 1200;
const USER_GUIDE_TURNSTILE_ACTION = 'user_guide_chat';

type AssistantCopy = {
  title: string;
  summary: string;
  expandLabel: string;
  collapseLabel: string;
  examplesLabel: string;
  examples: string[];
  inputPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  youLabel: string;
  assistantLabel: string;
  detailsLabel: string;
  sourcesLabel: string;
  nextPagesLabel: string;
  disabledInline: string;
  genericError: string;
  networkError: string;
  upstreamError: string;
  emptyResponseError: string;
  unavailableError: string;
  emptyQuestionError: string;
  forbiddenOriginError: string;
  challengeError: string;
  challengeExpiredError: string;
  challengePrompt: string;
  challengeVerifyingLabel: string;
  challengeLoadingError: string;
  throttledError: string;
  tooLongError: string;
};

type ApiErrorCode =
  | 'challenge_required'
  | 'disabled'
  | 'empty_response'
  | 'forbidden_origin'
  | 'invalid_request'
  | 'network_unreachable'
  | 'throttled'
  | 'upstream_error';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  nextPages?: AssistantPageLink[];
  sources?: AssistantPageLink[];
};

type AssistantPageLink = {
  id: string;
  path: string;
  title: string;
};

type ChallengeState =
  | {
      error: null | string;
      nonce: number;
      pendingQuestion: null;
      status: 'idle';
    }
  | {
      error: null | string;
      nonce: number;
      pendingQuestion: string;
      status: 'required' | 'verifying';
    };

function getApiErrorMessage({
  code,
  copy,
  fallback,
}: {
  code?: ApiErrorCode;
  copy: AssistantCopy;
  fallback?: string;
}) {
  if (code === 'network_unreachable') {
    return copy.networkError;
  }

  if (code === 'upstream_error') {
    return copy.upstreamError;
  }

  if (code === 'empty_response') {
    return copy.emptyResponseError;
  }

  if (code === 'disabled') {
    return copy.unavailableError;
  }

  if (code === 'challenge_required') {
    return fallback || copy.challengeError;
  }

  if (code === 'throttled') {
    return fallback || copy.throttledError;
  }

  if (code === 'forbidden_origin') {
    return fallback || copy.forbiddenOriginError;
  }

  if (code === 'invalid_request' && fallback) {
    return fallback;
  }

  return fallback || copy.genericError;
}

function createMessage(
  role: Message['role'],
  content: string,
  details?: Pick<Message, 'nextPages' | 'sources'>,
): Message {
  return {
    content,
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nextPages: details?.nextPages,
    role,
    sources: details?.sources,
  };
}

function resizeTextarea(element: HTMLTextAreaElement | null) {
  if (!element) {
    return;
  }

  element.style.height = '0px';

  const styles = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(styles.lineHeight) || 28;
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const borderTop = Number.parseFloat(styles.borderTopWidth) || 0;
  const borderBottom = Number.parseFloat(styles.borderBottomWidth) || 0;
  const maxHeight =
    lineHeight * 3 +
    paddingTop +
    paddingBottom +
    borderTop +
    borderBottom;
  const nextHeight = Math.min(element.scrollHeight, maxHeight);

  element.style.height = `${nextHeight}px`;
  element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function sanitizeAssistantPageLinks(value: unknown): AssistantPageLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as Record<string, unknown>;

    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.path !== 'string' ||
      typeof candidate.title !== 'string'
    ) {
      return [];
    }

    return [
      {
        id: candidate.id,
        path: candidate.path,
        title: candidate.title,
      },
    ];
  });
}

function MessageBubble({
  content,
  detailsLabel,
  isPending = false,
  label,
  nextPages = [],
  nextPagesLabel,
  role,
  sources = [],
  sourcesLabel,
}: {
  content: string;
  detailsLabel?: string;
  isPending?: boolean;
  label: string;
  nextPages?: AssistantPageLink[];
  nextPagesLabel?: string;
  role: Message['role'];
  sources?: AssistantPageLink[];
  sourcesLabel?: string;
}) {
  const isUser = role === 'user';
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasDetails = !isUser && (sources.length > 0 || nextPages.length > 0);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[90%]">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
            isUser
              ? 'text-right text-stone-400 dark:text-stone-500'
              : 'text-left text-stone-500 dark:text-stone-400'
          }`}
        >
          {label}
        </p>
        <div
          className={`mt-2 rounded-[18px] px-4 py-3 text-[0.95rem] leading-7 whitespace-pre-wrap ${
            isUser
              ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
              : 'border border-stone-200/80 bg-white/85 text-stone-700 dark:border-stone-800/80 dark:bg-stone-900/80 dark:text-stone-200'
          } ${isPending ? 'animate-pulse' : ''}`}
        >
          {content}
        </div>

        {hasDetails && detailsLabel ? (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-800 focus:outline-none focus-visible:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 dark:focus-visible:text-white"
            >
              {detailsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {detailsLabel}
            </button>

            {detailsOpen ? (
              <div className="mt-2 rounded-[16px] border border-stone-200/80 bg-white/60 px-3 py-3 text-sm dark:border-stone-800/80 dark:bg-stone-950/45">
                {sources.length > 0 && sourcesLabel ? (
                  <GuideLinkGroup label={sourcesLabel} links={sources} />
                ) : null}
                {nextPages.length > 0 && nextPagesLabel ? (
                  <GuideLinkGroup
                    label={nextPagesLabel}
                    links={nextPages}
                    className={sources.length > 0 ? 'mt-3' : ''}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GuideLinkGroup({
  className = '',
  label,
  links,
}: {
  className?: string;
  label: string;
  links: AssistantPageLink[];
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={`${label}-${link.id}`}
            href={link.path}
            className="rounded-full border border-stone-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900 dark:border-stone-800/80 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:text-white"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function createIdleChallengeState(nonce = 0): ChallengeState {
  return {
    error: null,
    nonce,
    pendingQuestion: null,
    status: 'idle',
  };
}

export function UserGuideAssistant({
  copy,
  enabled,
  locale,
  pageId,
  turnstileSiteKey,
}: {
  copy: AssistantCopy;
  enabled: boolean;
  locale: 'en' | 'zh-CN';
  pageId: string;
  turnstileSiteKey: null | string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState(enabled);
  const [challenge, setChallenge] = useState<ChallengeState>(() =>
    createIdleChallengeState(),
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasConversation = messages.length > 0 || pendingQuestion !== null;
  const panelId = `user-guide-assistant-${pageId}`;
  const showChallenge =
    serviceAvailable &&
    challenge.status !== 'idle' &&
    Boolean(turnstileSiteKey);

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [question, isExpanded, serviceAvailable]);

  useEffect(() => {
    if (isExpanded && serviceAvailable) {
      textareaRef.current?.focus();
    }
  }, [isExpanded, serviceAvailable]);

  async function submitQuestion(
    nextQuestion: string,
    options?: {
      turnstileToken?: string;
    },
  ) {
    if (!serviceAvailable || isSubmitting) {
      return;
    }

    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion) {
      setError(copy.emptyQuestionError);
      return;
    }

    if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
      setError(copy.tooLongError);
      return;
    }

    if (options?.turnstileToken) {
      setChallenge((current) => ({
        error: null,
        nonce: current.nonce,
        pendingQuestion: trimmedQuestion,
        status: 'verifying',
      }));
    }

    setError(null);
    setIsSubmitting(true);
    setPendingQuestion(trimmedQuestion);

    try {
      const response = await fetch('/api/user-guide-chat', {
        body: JSON.stringify({
          history: messages.map(({ content, role }) => ({ content, role })),
          locale,
          pageId,
          question: trimmedQuestion,
          turnstileToken: options?.turnstileToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            answer?: string;
            code?: ApiErrorCode;
            error?: string;
            nextPages?: unknown;
            sources?: unknown;
          }
        | null;

      if (!response.ok && payload?.code === 'disabled') {
        setServiceAvailable(false);
        setIsExpanded(false);
        setQuestion('');
        setError(null);
        setChallenge((current) => createIdleChallengeState(current.nonce));
        return;
      }

      if (!response.ok && payload?.code === 'challenge_required') {
        if (!turnstileSiteKey) {
          setError(copy.challengeLoadingError);
          setChallenge((current) => createIdleChallengeState(current.nonce + 1));
          return;
        }

        setChallenge((current) => ({
          error: getApiErrorMessage({
            code: payload.code,
            copy,
            fallback: payload.error,
          }),
          nonce: current.nonce + 1,
          pendingQuestion: trimmedQuestion,
          status: 'required',
        }));
        return;
      }

      if (!response.ok || !payload || typeof payload.answer !== 'string') {
        setChallenge((current) => createIdleChallengeState(current.nonce + 1));
        setError(
          getApiErrorMessage({
            code: payload?.code,
            copy,
            fallback: payload?.error,
          }),
        );
        return;
      }

      const answer = payload.answer;
      const nextPages = sanitizeAssistantPageLinks(payload.nextPages);
      const sources = sanitizeAssistantPageLinks(payload.sources);

      startTransition(() => {
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage('user', trimmedQuestion),
          createMessage('assistant', answer, {
            nextPages,
            sources,
          }),
        ]);
        setQuestion('');
        setChallenge((current) => createIdleChallengeState(current.nonce));
      });
    } catch (requestError) {
      console.error('Failed to ask guide assistant:', requestError);
      setChallenge((current) => createIdleChallengeState(current.nonce + 1));
      setError(copy.genericError);
    } finally {
      setIsSubmitting(false);
      setPendingQuestion(null);
    }
  }

  return (
    <section className="mb-10 overflow-hidden rounded-[22px] border border-stone-200/70 bg-white/60 shadow-[0_18px_60px_-48px_rgba(87,83,78,0.45)] backdrop-blur-md dark:border-stone-800/70 dark:bg-stone-900/35 dark:shadow-[0_18px_60px_-48px_rgba(0,0,0,0.65)]">
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200/70 bg-stone-50/90 text-stone-500 dark:border-stone-800/70 dark:bg-stone-950/70 dark:text-stone-400">
            <Sparkles size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[0.96rem] font-medium text-stone-800 dark:text-stone-100">
              {copy.title}
            </p>
            <p
              className={`mt-0.5 text-sm leading-6 ${
                serviceAvailable
                  ? 'text-stone-500 dark:text-stone-400'
                  : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {serviceAvailable ? copy.summary : copy.disabledInline}
            </p>
          </div>
        </div>

        {serviceAvailable ? (
          <button
            type="button"
            aria-controls={panelId}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? copy.collapseLabel : copy.expandLabel}
            onClick={() => {
              setIsExpanded((current) => !current);
            }}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/85 text-stone-700 transition-colors hover:border-stone-300 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F2] dark:border-stone-800/80 dark:bg-stone-950/60 dark:text-stone-200 dark:hover:border-stone-700 dark:hover:text-white dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#121212]"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        ) : null}
      </div>

      {serviceAvailable && isExpanded ? (
        <div
          id={panelId}
          className="border-t border-stone-200/70 px-4 py-4 dark:border-stone-800/70 sm:px-5 sm:py-5"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitQuestion(question);
            }}
          >
            <div className="overflow-hidden rounded-[18px] border border-stone-200/80 bg-stone-50/70 transition-colors focus-within:border-stone-400 dark:border-stone-800/80 dark:bg-[#171717] dark:focus-within:border-stone-600">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  if (error) {
                    setError(null);
                  }
                  if (challenge.status !== 'idle') {
                    setChallenge((current) =>
                      createIdleChallengeState(current.nonce + 1),
                    );
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submitQuestion(question);
                  }
                }}
                disabled={isSubmitting}
                rows={1}
                maxLength={MAX_QUESTION_LENGTH}
                placeholder={copy.inputPlaceholder}
                className="block min-h-[56px] w-full resize-none border-0 bg-transparent px-4 py-4 text-[0.96rem] leading-7 text-stone-700 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
            </div>

            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                {copy.examplesLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {copy.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setQuestion(example);
                      void submitQuestion(example);
                    }}
                    className="text-left text-sm text-stone-500 underline decoration-stone-300/70 underline-offset-4 transition-colors hover:text-stone-800 hover:decoration-stone-500 focus:outline-none focus-visible:text-stone-900 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-stone-100 dark:hover:decoration-stone-500 dark:focus-visible:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {showChallenge ? (
              <div className="mt-3 rounded-[18px] border border-amber-300/80 bg-amber-50/80 px-4 py-4 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300/80 bg-white/70 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
                    <ShieldCheck size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{copy.challengePrompt}</p>
                    {challenge.error ? (
                      <p className="mt-1 text-sm text-amber-800 dark:text-amber-100/85">
                        {challenge.error}
                      </p>
                    ) : null}
                    {turnstileSiteKey ? (
                      <div className="mt-3">
                        <TurnstileWidget
                          key={challenge.nonce}
                          action={USER_GUIDE_TURNSTILE_ACTION}
                          onError={() => {
                            setChallenge((current) => ({
                              error: copy.challengeLoadingError,
                              nonce: current.nonce,
                              pendingQuestion:
                                current.status === 'idle'
                                  ? question.trim()
                                  : current.pendingQuestion,
                              status: 'required',
                            }));
                          }}
                          onExpire={() => {
                            setChallenge((current) => ({
                              error: copy.challengeExpiredError,
                              nonce: current.nonce + 1,
                              pendingQuestion:
                                current.status === 'idle'
                                  ? question.trim()
                                  : current.pendingQuestion,
                              status: 'required',
                            }));
                          }}
                          onToken={(token) => {
                            void submitQuestion(challenge.pendingQuestion, {
                              turnstileToken: token,
                            });
                          }}
                          siteKey={turnstileSiteKey}
                        />
                      </div>
                    ) : null}
                    {challenge.status === 'verifying' ? (
                      <p className="mt-2 text-sm text-amber-800 dark:text-amber-100/85">
                        {copy.challengeVerifyingLabel}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                aria-live="polite"
                className={`text-sm ${
                  error
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {error ?? `${question.trim().length}/${MAX_QUESTION_LENGTH}`}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F2] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300 dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#121212]"
              >
                <Send size={14} />
                {isSubmitting ? copy.submittingLabel : copy.submitLabel}
              </button>
            </div>
          </form>

          {hasConversation ? (
            <div className="mt-4 border-t border-stone-200/70 pt-4 dark:border-stone-800/70">
              <div className="max-h-[26rem] space-y-4 overflow-y-auto pr-1">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    content={message.content}
                    detailsLabel={copy.detailsLabel}
                    label={
                      message.role === 'user'
                        ? copy.youLabel
                        : copy.assistantLabel
                    }
                    nextPages={message.nextPages}
                    nextPagesLabel={copy.nextPagesLabel}
                    role={message.role}
                    sources={message.sources}
                    sourcesLabel={copy.sourcesLabel}
                  />
                ))}

                {pendingQuestion ? (
                  <>
                    <MessageBubble
                      content={pendingQuestion}
                      label={copy.youLabel}
                      role="user"
                    />
                    <MessageBubble
                      content={copy.submittingLabel}
                      isPending
                      label={copy.assistantLabel}
                      role="assistant"
                    />
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

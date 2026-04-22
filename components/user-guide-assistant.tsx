'use client';

import { startTransition, useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const MAX_QUESTION_LENGTH = 1200;

type AssistantCopy = {
  eyebrow: string;
  title: string;
  description: string;
  currentPageLabel: string;
  examplesLabel: string;
  examples: string[];
  inputPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  emptyState: string;
  youLabel: string;
  assistantLabel: string;
  disabledTitle: string;
  disabledBody: string;
  genericError: string;
  networkError: string;
  upstreamError: string;
  emptyResponseError: string;
  unavailableError: string;
  emptyQuestionError: string;
  tooLongError: string;
};

type ApiErrorCode =
  | 'disabled'
  | 'empty_response'
  | 'invalid_request'
  | 'network_unreachable'
  | 'upstream_error';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
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

  if (code === 'invalid_request' && fallback) {
    return fallback;
  }

  return fallback || copy.genericError;
}

function createMessage(role: Message['role'], content: string): Message {
  return {
    content,
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
  };
}

function MessageBubble({
  content,
  isPending = false,
  label,
  role,
}: {
  content: string;
  isPending?: boolean;
  label: string;
  role: Message['role'];
}) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[88%]">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
            isUser
              ? 'text-right text-stone-400 dark:text-stone-500'
              : 'text-left text-stone-500 dark:text-stone-400'
          }`}
        >
          {label}
        </p>
        <div
          className={`mt-2 rounded-[22px] px-4 py-3 text-[0.95rem] leading-7 whitespace-pre-wrap sm:px-5 sm:py-4 ${
            isUser
              ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
              : 'border border-stone-200/80 bg-white/80 text-stone-700 dark:border-stone-800/80 dark:bg-stone-900/80 dark:text-stone-200'
          } ${isPending ? 'animate-pulse' : ''}`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

export function UserGuideAssistant({
  copy,
  enabled,
  locale,
  pageId,
  pageTitle,
}: {
  copy: AssistantCopy;
  enabled: boolean;
  locale: 'en' | 'zh-CN';
  pageId: string;
  pageTitle: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState(enabled);

  async function submitQuestion(nextQuestion: string) {
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
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const payload = (await response.json().catch(() => null)) as
        | { answer?: string; code?: ApiErrorCode; error?: string }
        | null;

      if (!response.ok && payload?.code === 'disabled') {
        setServiceAvailable(false);
        return;
      }

      if (!response.ok || !payload || typeof payload.answer !== 'string') {
        setError(
          getApiErrorMessage({
            code: payload?.code,
            copy,
            fallback: payload?.error,
          }),
        );
        return;
      }

      startTransition(() => {
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage('user', trimmedQuestion),
          createMessage('assistant', payload.answer!),
        ]);
        setQuestion('');
      });
    } catch (requestError) {
      console.error('Failed to ask guide assistant:', requestError);
      setError(copy.genericError);
    } finally {
      setIsSubmitting(false);
      setPendingQuestion(null);
    }
  }

  return (
    <section className="mb-14 overflow-hidden rounded-[28px] border border-stone-200/70 bg-white/65 shadow-[0_28px_100px_-68px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-900/45 dark:shadow-[0_28px_100px_-68px_rgba(0,0,0,0.72)]">
      <div className="border-b border-stone-200/70 px-5 py-6 dark:border-stone-800/70 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
              {copy.eyebrow}
            </p>
            <h2
              className="mt-4 text-[2rem] leading-tight text-stone-800 dark:text-stone-100 sm:text-[2.35rem]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {copy.title}
            </h2>
            <p className="mt-4 text-[1rem] font-light leading-[1.8] text-stone-500 dark:text-stone-400 sm:text-lg">
              {copy.description}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200/80 bg-stone-50/80 px-4 py-2 text-sm text-stone-600 dark:border-stone-800/80 dark:bg-stone-950/60 dark:text-stone-300">
            <Sparkles size={15} className="text-stone-400 dark:text-stone-500" />
            <span>
              {copy.currentPageLabel}: {pageTitle}
            </span>
          </div>
        </div>

        {serviceAvailable ? (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
              {copy.examplesLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {copy.examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuestion(example);
                    void submitQuestion(example);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-stone-800/80 dark:bg-stone-950/55 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:text-stone-100 dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-stone-900"
                >
                  <MessageSquare size={14} />
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        {serviceAvailable ? (
          <>
            <div className="rounded-[24px] border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800/80 dark:bg-[#171717] sm:p-5">
              <div className="space-y-4">
                {messages.length === 0 && !pendingQuestion ? (
                  <div className="rounded-[22px] border border-dashed border-stone-200/80 bg-white/70 px-4 py-6 text-[0.95rem] leading-7 text-stone-500 dark:border-stone-800/80 dark:bg-stone-950/45 dark:text-stone-400">
                    {copy.emptyState}
                  </div>
                ) : null}

                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    content={message.content}
                    label={
                      message.role === 'user'
                        ? copy.youLabel
                        : copy.assistantLabel
                    }
                    role={message.role}
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

            <form
              className="mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submitQuestion(question);
              }}
            >
              <textarea
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submitQuestion(question);
                  }
                }}
                disabled={isSubmitting}
                rows={4}
                maxLength={MAX_QUESTION_LENGTH}
                placeholder={copy.inputPlaceholder}
                className="w-full rounded-[24px] border border-stone-200/80 bg-white/80 px-4 py-4 text-[0.96rem] leading-7 text-stone-700 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-800/80 dark:bg-stone-900/70 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-600"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-sm ${error ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500 dark:text-stone-400'}`}>
                  {error ?? `${question.trim().length}/${MAX_QUESTION_LENGTH}`}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300 dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-stone-900"
                >
                  <Send size={15} />
                  {isSubmitting ? copy.submittingLabel : copy.submitLabel}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-amber-300/80 bg-amber-50/70 px-5 py-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <p className="text-lg font-medium">{copy.disabledTitle}</p>
            <p className="mt-2 text-[0.96rem] leading-7 text-amber-800/80 dark:text-amber-100/80">
              {copy.disabledBody}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

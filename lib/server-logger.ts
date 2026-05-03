import 'server-only';

export type ServerLogLevel = 'error' | 'info' | 'silent' | 'warn';

type WritableLogLevel = Exclude<ServerLogLevel, 'silent'>;

type RequestLoggerOptions = {
  method: string;
  route: string;
};

type RequestLogger = {
  error: (event: string, fields?: LogFields) => void;
  info: (event: string, fields?: LogFields) => void;
  logSlowRequest: (status: number) => void;
  requestId: string;
  warn: (event: string, fields?: LogFields) => void;
  withRequestId: <T extends Response>(response: T) => T;
};

type LogFields = Record<string, unknown>;

const DEFAULT_LOG_LEVEL: ServerLogLevel = 'info';
const DEFAULT_SLOW_REQUEST_MS = 3000;
const REQUEST_ID_HEADER = 'X-Request-Id';
const REDACTED_VALUE = '[redacted]';
const LOG_LEVEL_ORDER: Record<WritableLogLevel, number> = {
  info: 10,
  warn: 20,
  error: 30,
};
const SENSITIVE_KEYS = new Set([
  'apikey',
  'api_key',
  'authorization',
  'cookie',
  'history',
  'ip',
  'proxyurl',
  'question',
  'remoteip',
  'token',
  'turnstiletoken',
]);

function normalizeKey(key: string) {
  return key.replace(/[-_\s]/g, '').toLowerCase();
}

function isSensitiveKey(key: string) {
  const normalized = normalizeKey(key);

  return (
    SENSITIVE_KEYS.has(normalized) ||
    normalized.endsWith('token') ||
    normalized.endsWith('secret') ||
    normalized.endsWith('ip') ||
    normalized.endsWith('apikey') ||
    normalized.includes('authorization') ||
    normalized.includes('cookie') ||
    normalized.includes('forwardedfor') ||
    normalized.includes('password') ||
    normalized.includes('proxyurl')
  );
}

function serializeError(error: Error) {
  const errorWithCode = error as Error & { code?: unknown };

  return {
    code: typeof errorWithCode.code === 'string' ? errorWithCode.code : undefined,
    message: error.message,
    name: error.name,
  };
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Error) {
    return serializeError(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === 'object') {
    return sanitizeLogFields(value as LogFields);
  }

  return value;
}

export function sanitizeLogFields(fields: LogFields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      isSensitiveKey(key) ? REDACTED_VALUE : sanitizeValue(value),
    ]),
  );
}

export function getServerLogConfig() {
  const configuredLevel = process.env.SERVER_LOG_LEVEL?.trim().toLowerCase();
  const level: ServerLogLevel =
    configuredLevel === 'error' ||
    configuredLevel === 'info' ||
    configuredLevel === 'silent' ||
    configuredLevel === 'warn'
      ? configuredLevel
      : DEFAULT_LOG_LEVEL;
  const configuredSlowMs = Number(process.env.SERVER_LOG_SLOW_MS);
  const slowRequestMs =
    Number.isFinite(configuredSlowMs) && configuredSlowMs >= 0
      ? configuredSlowMs
      : DEFAULT_SLOW_REQUEST_MS;

  return {
    level,
    slowRequestMs,
  };
}

function shouldWriteLog(level: WritableLogLevel) {
  const configuredLevel = getServerLogConfig().level;

  if (configuredLevel === 'silent') {
    return false;
  }

  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[configuredLevel];
}

function writeConsoleLine(level: WritableLogLevel, line: string) {
  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.info(line);
}

function getDurationMs(startedAt: number) {
  return Math.round((performance.now() - startedAt) * 100) / 100;
}

function normalizeIncomingRequestId(value: null | string) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.length > 128) {
    return null;
  }

  return /^[A-Za-z0-9._:-]+$/.test(trimmed) ? trimmed : null;
}

function createRequestId(request: Request) {
  return (
    normalizeIncomingRequestId(request.headers.get('x-request-id')) ??
    crypto.randomUUID()
  );
}

export function createRequestLogger(
  request: Request,
  { method, route }: RequestLoggerOptions,
): RequestLogger {
  const requestId = createRequestId(request);
  const startedAt = performance.now();
  const normalizedMethod = method.toUpperCase();

  function write(
    level: WritableLogLevel,
    event: string,
    fields: LogFields = {},
  ) {
    if (!shouldWriteLog(level)) {
      return;
    }

    const payload = {
      ...sanitizeLogFields(fields),
      durationMs: getDurationMs(startedAt),
      event,
      level,
      method: normalizedMethod,
      requestId,
      route,
      timestamp: new Date().toISOString(),
    };

    writeConsoleLine(level, JSON.stringify(payload));
  }

  return {
    error: (event, fields) => write('error', event, fields),
    info: (event, fields) => write('info', event, fields),
    logSlowRequest: (status) => {
      const durationMs = getDurationMs(startedAt);

      if (durationMs < getServerLogConfig().slowRequestMs) {
        return;
      }

      write('info', 'api_slow_request', {
        durationMs,
        status,
      });
    },
    requestId,
    warn: (event, fields) => write('warn', event, fields),
    withRequestId: (response) => {
      response.headers.set(REQUEST_ID_HEADER, requestId);
      return response;
    },
  };
}

const FALLBACK_SITE_URL = 'http://localhost:3000';

function normalizeSiteUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  const explicitUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelUrl = normalizeSiteUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
  );
  if (vercelUrl) {
    return vercelUrl;
  }

  return new URL(FALLBACK_SITE_URL);
}

export function getAbsoluteUrl(path = '/') {
  return new URL(path, getSiteUrl()).toString();
}

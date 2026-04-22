const FALLBACK_SITE_URL = 'http://localhost:3000';
const DEPLOYMENT_ENVIRONMENT_VARIABLES = [
  'SITE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
] as const;

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

function getConfiguredSiteUrl() {
  for (const envVar of DEPLOYMENT_ENVIRONMENT_VARIABLES) {
    const candidate = normalizeSiteUrl(process.env[envVar]);
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

function isLocalHostname(hostname: string) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1'
  );
}

function shouldRequirePublicSiteUrl() {
  return (
    process.env.NODE_ENV === 'production' &&
    (process.env.CI === 'true' ||
      process.env.VERCEL === '1' ||
      process.env.CF_PAGES === '1')
  );
}

export function getPublicSiteUrl() {
  const configuredUrl = getConfiguredSiteUrl();

  if (!configuredUrl || isLocalHostname(configuredUrl.hostname)) {
    return null;
  }

  return configuredUrl;
}

export function getSiteUrl() {
  const configuredUrl = getConfiguredSiteUrl();
  if (configuredUrl) {
    if (
      shouldRequirePublicSiteUrl() &&
      isLocalHostname(configuredUrl.hostname)
    ) {
      throw new Error(
        'SITE_URL must point to a public production domain during deployed builds.',
      );
    }

    return configuredUrl;
  }

  if (shouldRequirePublicSiteUrl()) {
    throw new Error(
      'Missing SITE_URL. Set SITE_URL or NEXT_PUBLIC_SITE_URL for deployed builds.',
    );
  }

  return new URL(FALLBACK_SITE_URL);
}

export function getAbsoluteUrl(path = '/') {
  return new URL(path, getSiteUrl()).toString();
}

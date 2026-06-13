import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/user-guide-search/route';

describe('user guide search route', () => {
  it('returns a locale-specific search index', async () => {
    const response = await GET(
      new Request('https://sona.example.com/api/user-guide-search?locale=ko'),
    );
    const payload = (await response.json()) as {
      entries?: Array<{ id: string; path: string; title: string }>;
    };

    expect(response.status).toBe(200);
    expect(payload.entries?.length).toBeGreaterThan(0);
    expect(payload.entries?.some((entry) => entry.id === 'api-guide')).toBe(true);
    expect(payload.entries?.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
  });

  it('rejects unsupported locales', async () => {
    const response = await GET(
      new Request('https://sona.example.com/api/user-guide-search?locale=fr'),
    );
    const payload = (await response.json()) as { code?: string };

    expect(response.status).toBe(400);
    expect(payload.code).toBe('invalid_locale');
  });
});

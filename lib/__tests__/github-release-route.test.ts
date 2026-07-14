import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/github-release/route';
import type { ReleaseResponseBody } from '@/lib/release-downloads';

const stablePayload = {
  tag_name: 'v0.9.0',
  name: 'Sona v0.9.0',
  html_url: 'https://github.com/AirSodaz/sona/releases/tag/v0.9.0',
  assets: [
    {
      name: 'Sona_0.9.0_x64-setup.exe',
      size: 1024,
      browser_download_url: 'https://downloads.example.com/sona-x64.exe',
    },
    {
      name: 'Sona_0.9.0_x64_en-US.msi',
      size: 2048,
      browser_download_url: 'https://downloads.example.com/sona-x64.msi',
    },
    {
      name: 'Sona_0.9.0_amd64.AppImage',
      size: 4096,
      browser_download_url: 'https://downloads.example.com/sona.AppImage',
    },
    {
      name: 'app-arm64-v8a-debug.apk',
      size: 8192,
      browser_download_url: 'https://downloads.example.com/sona-debug.apk',
    },
    {
      name: 'Sona_0.9.0_x64-setup.exe.sig',
      size: 128,
      browser_download_url: 'https://downloads.example.com/sona-x64.exe.sig',
    },
    {
      name: 'updater.json',
      size: 256,
      browser_download_url: 'https://downloads.example.com/updater.json',
    },
  ],
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('GitHub release route', () => {
  it('loads the latest stable release by default and excludes APKs from downloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json(stablePayload),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(
      new Request('https://sona.example.com/api/github-release'),
    );
    const payload = (await response.json()) as ReleaseResponseBody;

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/AirSodaz/sona/releases/latest',
      expect.any(Object),
    );
    expect(payload.channel).toBe('stable');
    expect(payload.releaseName).toBe('Sona v0.9.0');
    expect(payload.recommended.windows.x64?.format).toBe('exe');
    expect(payload.downloads.linux.x64?.[0].format).toBe('appimage');
    expect(JSON.stringify(payload.downloads)).not.toContain('.apk');
    expect(payload.assets.some((asset) => asset.name.endsWith('.apk'))).toBe(
      true,
    );
  });

  it('loads the moving nightly release by its fixed tag', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        ...stablePayload,
        tag_name: 'nightly',
        name: 'Nightly 2026-07-14 (0.9.0-nightly.20260714)',
        html_url: 'https://github.com/AirSodaz/sona/releases/tag/nightly',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(
      new Request(
        'https://sona.example.com/api/github-release?channel=nightly',
      ),
    );
    const payload = (await response.json()) as ReleaseResponseBody;

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/AirSodaz/sona/releases/tags/nightly',
      expect.any(Object),
    );
    expect(payload.channel).toBe('nightly');
    expect(payload.version).toBe('nightly');
    expect(payload.releaseName).toBe(
      'Nightly 2026-07-14 (0.9.0-nightly.20260714)',
    );
  });

  it('rejects unsupported channels without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(
      new Request('https://sona.example.com/api/github-release?channel=beta'),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Unsupported release channel.',
    });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps the existing null response for upstream failures', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 503 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(
      new Request(
        'https://sona.example.com/api/github-release?channel=nightly',
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeNull();
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
  });
});

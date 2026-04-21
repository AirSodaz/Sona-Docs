import { NextResponse } from 'next/server';

const GITHUB_RELEASE_URL =
  'https://api.github.com/repos/AirSodaz/sona/releases/latest';
const SUCCESS_CACHE_SECONDS = 60 * 60;
const FAILURE_CACHE_SECONDS = 60 * 5;
const STALE_WHILE_REVALIDATE_SECONDS = 60 * 60 * 24;
const REQUEST_TIMEOUT_MS = 8000;

interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name?: string;
  html_url?: string;
  assets?: GitHubReleaseAsset[];
}

function buildCacheControl(maxAge: number) {
  return `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;
}

function jsonResponse(body: null | { version: string; url: string; assets: { name: string; size: number; url: string }[] }, cacheSeconds: number) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': buildCacheControl(cacheSeconds),
    },
  });
}

export async function GET() {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Sona-Docs-App',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_RELEASE_URL, {
      headers,
      next: { revalidate: SUCCESS_CACHE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return jsonResponse(null, FAILURE_CACHE_SECONDS);
    }

    const data = (await response.json()) as GitHubRelease;

    if (!data.tag_name || !data.html_url) {
      return jsonResponse(null, FAILURE_CACHE_SECONDS);
    }

    const assets =
      data.assets?.map((asset) => ({
        name: asset.name,
        size: asset.size,
        url: asset.browser_download_url,
      })) ?? [];

    return jsonResponse(
      {
        version: data.tag_name,
        url: data.html_url,
        assets,
      },
      SUCCESS_CACHE_SECONDS,
    );
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    return jsonResponse(null, FAILURE_CACHE_SECONDS);
  }
}

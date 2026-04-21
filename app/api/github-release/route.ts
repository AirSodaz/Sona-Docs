import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Sona-Docs-App',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch the latest release from GitHub, cache for 1 hour
    const response = await fetch('https://api.github.com/repos/AirSodaz/sona/releases/latest', {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // Return 404/403 gracefully as empty release info
      return NextResponse.json(null);
    }

    const data = await response.json();

    if (!data || !data.tag_name) {
      return NextResponse.json(null);
    }

    const assets = data.assets?.map((a: any) => ({
      name: a.name,
      size: a.size,
      url: a.browser_download_url,
    })) || [];

    return NextResponse.json({
      version: data.tag_name,
      url: data.html_url,
      assets,
    });
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    return NextResponse.json(null);
  }
}

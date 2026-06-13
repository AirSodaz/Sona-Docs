import { NextResponse } from 'next/server';
import { isHomeLocale } from '@/lib/locales';
import { getUserGuideSearchEntries } from '@/lib/user-guide-search';

export const runtime = 'nodejs';

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
    status,
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale');

  if (!isHomeLocale(locale)) {
    return jsonResponse(
      {
        code: 'invalid_locale',
        error: 'Invalid locale.',
      },
      400,
    );
  }

  try {
    const entries = await getUserGuideSearchEntries(locale);

    return jsonResponse({ entries });
  } catch {
    return jsonResponse(
      {
        code: 'search_index_error',
        error: 'Unable to load user guide search index.',
      },
      500,
    );
  }
}

import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  getUserGuidePageById,
  type UserGuidePageId,
} from '@/lib/user-guide-content';

const USER_GUIDE_CONTENT_DIR = path.join(process.cwd(), 'content', 'user-guide');

export const getUserGuideMarkdown = cache(
  async (locale: HomeLocale, pageId: UserGuidePageId) => {
    const page = getUserGuidePageById(locale, pageId);
    const filePath = path.join(USER_GUIDE_CONTENT_DIR, page.contentFile);

    return readFile(filePath, 'utf8');
  },
);

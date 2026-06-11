import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh-CN', 'zh-TW', 'ja'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Disable locale prefix for the default locale if preferred, but since we decided
  // "标准前缀路由方案：所有语言都有前缀", we keep localePrefix: 'always' (the default is 'always' or we can set it explicitly).
  localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

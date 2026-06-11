import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for the ones starting with:
  // - _next (internal files)
  // - api (API routes)
  // - _vercel (Vercel internals)
  // - static files (e.g. svg, png, ico, txt, xml, etc. - checked via extension dot)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

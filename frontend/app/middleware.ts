import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '../i18n';
import { NextRequest } from 'next/server';

const handleI18nRouting = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

export async function middleware(request: NextRequest) {
  // 1. Handle i18n routing
  let response = handleI18nRouting(request);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|pt)/:path*']
};

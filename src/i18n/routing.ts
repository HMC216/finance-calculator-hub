import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config.ts';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

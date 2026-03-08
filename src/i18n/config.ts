export const locales = ['en', 'es', 'zh', 'ko', 'ja', 'ar', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  ko: '한국어',
  ja: '日本語',
  ar: 'العربية',
  fr: 'Français',
};

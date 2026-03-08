import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '../constants.ts';
import { locales } from '@/i18n/config.ts';

/**
 * Build hreflang alternates for a given path segment.
 */
function buildLanguageAlternates(pathSegment: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}${pathSegment}`;
  }
  return languages;
}

type CalculatorKey = 'compound-interest' | 'investment-growth' | 'retirement';

const calculatorSlugs: Record<CalculatorKey, string> = {
  'compound-interest': '/compound-interest-calculator',
  'investment-growth': '/investment-growth-calculator',
  retirement: '/retirement-calculator',
};

const calculatorSeoKeys: Record<CalculatorKey, string> = {
  'compound-interest': 'compoundInterest',
  'investment-growth': 'investmentGrowth',
  retirement: 'retirement',
};

/**
 * Build Next.js Metadata for a calculator page using translations.
 */
export async function buildCalculatorMetadata(
  calculatorKey: CalculatorKey,
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const seoKey = calculatorSeoKeys[calculatorKey];
  const slug = calculatorSlugs[calculatorKey];

  const fullTitle = t(`seo.${seoKey}.fullTitle`);
  const description = t(`seo.${seoKey}.description`);
  const canonicalUrl = `${SITE_CONFIG.url}/${locale}${slug}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(slug),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: t('common.siteName'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

/**
 * Build Next.js Metadata for the home page using translations.
 */
export async function buildHomeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale });

  const title = t('seo.home.title');
  const description = t('seo.home.description');
  const canonicalUrl = `${SITE_CONFIG.url}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(''),
    },
    openGraph: {
      title,
      description: t('seo.home.ogDescription'),
      url: canonicalUrl,
      siteName: t('common.siteName'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t('seo.home.ogDescription'),
    },
  };
}

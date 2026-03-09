import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildFAQSchema, buildWebAppSchema } from '@/lib/seo/schemas.ts';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';
import JsonLd from '@/components/seo/JsonLd.tsx';
import FAQSection from '@/components/seo/FAQSection.tsx';
import AuthorBio from '@/components/seo/AuthorBio.tsx';
import Disclaimer from '@/components/seo/Disclaimer.tsx';
import RelatedCalculators from '@/components/seo/RelatedCalculators.tsx';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator.tsx';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const fullTitle = t('seo.compoundInterest.fullTitle');
  const description = t('seo.compoundInterest.description');

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/compound-interest-calculator`;
  }

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/compound-interest-calculator`,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_CONFIG.url}/${locale}/compound-interest-calculator`,
      siteName: t('common.siteName'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: fullTitle,
      description,
    },
  };
}

export default async function CompoundInterestCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    question: t(`faq.compoundInterest.q${i + 1}`),
    answer: t(`faq.compoundInterest.a${i + 1}`),
  }));

  const faqSchema = buildFAQSchema(faqItems);
  const webAppSchema = buildWebAppSchema({
    name: t('seo.compoundInterest.webAppName'),
    url: `${SITE_CONFIG.url}/${locale}/compound-interest-calculator`,
    description: t('seo.compoundInterest.webAppDescription'),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd schema={[faqSchema, webAppSchema]} />

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {t('seo.compoundInterest.h1')}
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        {t('seo.compoundInterest.subtitle')}
      </p>

      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">{t('common.loadingCalculator')}</div>
          </div>
        }
      >
        <CompoundInterestCalculator />
      </Suspense>

      {/* How It Works Section — collapsed by default */}
      <section className="mt-16" aria-labelledby="how-it-works-heading">
        <details className="group rounded-xl border border-gray-200 bg-white">
          <summary className="flex cursor-pointer items-center justify-between px-6 py-4">
            <h2 id="how-it-works-heading" className="text-2xl font-bold text-gray-900">
              {t('howItWorks.compoundInterest.heading')}
            </h2>
            <svg className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="border-t border-gray-100 px-6 py-4 prose prose-gray max-w-none text-gray-700">
            <p>{t('howItWorks.compoundInterest.p1')}</p>
            <p>{t('howItWorks.compoundInterest.p2')}</p>
            <p>{t('howItWorks.compoundInterest.p3')}</p>
            <p>{t('howItWorks.compoundInterest.p4')}</p>
          </div>
        </details>
      </section>

      {/* FAQ */}
      <FAQSection items={faqItems} heading={t('faq.heading')} />

      {/* Related Calculators */}
      <RelatedCalculators current="compound-interest" />

      {/* Author & Disclaimer */}
      <AuthorBio />
      <Disclaimer />
    </div>
  );
}

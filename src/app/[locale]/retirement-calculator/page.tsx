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
import RetirementCalculator from '@/components/calculators/RetirementCalculator.tsx';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const fullTitle = t('seo.retirement.fullTitle');
  const description = t('seo.retirement.description');

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/retirement-calculator`;
  }

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/retirement-calculator`,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_CONFIG.url}/${locale}/retirement-calculator`,
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

export default async function RetirementCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    question: t(`faq.retirement.q${i + 1}`),
    answer: t(`faq.retirement.a${i + 1}`),
  }));

  const faqSchema = buildFAQSchema(faqItems);
  const webAppSchema = buildWebAppSchema({
    name: t('seo.retirement.webAppName'),
    url: `${SITE_CONFIG.url}/${locale}/retirement-calculator`,
    description: t('seo.retirement.webAppDescription'),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd schema={[faqSchema, webAppSchema]} />

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {t('seo.retirement.h1')}
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        {t('seo.retirement.subtitle')}
      </p>

      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">{t('common.loadingCalculator')}</div>
          </div>
        }
      >
        <RetirementCalculator />
      </Suspense>

      {/* How It Works Section */}
      <section className="mt-16" aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="mb-4 text-2xl font-bold text-gray-900"
        >
          {t('howItWorks.retirement.heading')}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-700">
          <p>{t('howItWorks.retirement.p1')}</p>
          <p>{t('howItWorks.retirement.p2')}</p>
          <p>{t('howItWorks.retirement.p3')}</p>
          <p>{t('howItWorks.retirement.p4')}</p>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={faqItems} heading={t('faq.heading')} />

      {/* Related Calculators */}
      <RelatedCalculators current="retirement" />

      {/* Author & Disclaimer */}
      <AuthorBio />
      <Disclaimer />
    </div>
  );
}

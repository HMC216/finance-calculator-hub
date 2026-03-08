import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/disclaimer`;
  }

  return {
    title: t('disclaimerPage.metaTitle'),
    description: t('disclaimerPage.metaDescription'),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/disclaimer`,
      languages,
    },
  };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {t('disclaimerPage.title')}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {t('common.lastUpdated')}
      </p>

      <div className="mt-8 space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.notFinancialAdvice')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.notFinancialAdviceP1')}</p>
            <p>{t('disclaimerPage.notFinancialAdviceP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.educationalPurposes')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.educationalP1')}</p>
            <p>{t('disclaimerPage.educationalP2')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('disclaimerPage.eduItem1')}</li>
              <li>{t('disclaimerPage.eduItem2')}</li>
              <li>{t('disclaimerPage.eduItem3')}</li>
              <li>{t('disclaimerPage.eduItem4')}</li>
              <li>{t('disclaimerPage.eduItem5')}</li>
              <li>{t('disclaimerPage.eduItem6')}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.pastPerformance')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.pastPerformanceP1')}</p>
            <p>{t('disclaimerPage.pastPerformanceP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.consultProfessional')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.consultP1')}</p>
            <p>{t('disclaimerPage.consultP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.noWarranties')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.noWarrantiesP1')}</p>
            <p>{t('disclaimerPage.noWarrantiesP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.limitationOfLiability')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('disclaimerPage.limitationP1')}</p>
            <p>{t('disclaimerPage.limitationP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('disclaimerPage.contactHeading')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>
              {t('disclaimerPage.contactText')}{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

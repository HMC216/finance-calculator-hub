import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/terms-of-service`;
  }

  return {
    title: t('termsOfService.metaTitle'),
    description: t('termsOfService.metaDescription'),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/terms-of-service`,
      languages,
    },
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {t('termsOfService.title')}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {t('common.lastUpdated')}
      </p>

      <div className="mt-8 space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('termsOfService.acceptanceOfTerms')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('termsOfService.acceptanceP1')}</p>
            <p>{t('termsOfService.acceptanceP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('termsOfService.useOfService')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('termsOfService.useOfServiceP1')}</p>
            <p>{t('termsOfService.useOfServiceP2')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('termsOfService.useItem1')}</li>
              <li>{t('termsOfService.useItem2')}</li>
              <li>{t('termsOfService.useItem3')}</li>
              <li>{t('termsOfService.useItem4')}</li>
              <li>{t('termsOfService.useItem5')}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('termsOfService.disclaimer')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('termsOfService.disclaimerP1')}</p>
            <p>{t('termsOfService.disclaimerP2')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('termsOfService.disclaimerItem1')}</li>
              <li>{t('termsOfService.disclaimerItem2')}</li>
              <li>{t('termsOfService.disclaimerItem3')}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('termsOfService.limitationOfLiability')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('termsOfService.limitationP1')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('termsOfService.limitationItem1')}</li>
              <li>{t('termsOfService.limitationItem2')}</li>
              <li>{t('termsOfService.limitationItem3')}</li>
              <li>{t('termsOfService.limitationItem4')}</li>
            </ul>
            <p>{t('termsOfService.limitationP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('termsOfService.changesToTerms')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('termsOfService.changesP1')}</p>
            <p>{t('termsOfService.changesP2')}</p>
            <p>
              {t('termsOfService.contactText')}{' '}
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

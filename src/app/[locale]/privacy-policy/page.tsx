import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/privacy-policy`;
  }

  return {
    title: t('privacyPolicy.metaTitle'),
    description: t('privacyPolicy.metaDescription'),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/privacy-policy`,
      languages,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {t('privacyPolicy.title')}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {t('common.lastUpdated')}
      </p>

      <div className="mt-8 space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('privacyPolicy.informationWeCollect')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('privacyPolicy.informationWeCollectP1')}</p>
            <p>{t('privacyPolicy.informationWeCollectP2')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('privacyPolicy.infoItem1')}</li>
              <li>{t('privacyPolicy.infoItem2')}</li>
              <li>{t('privacyPolicy.infoItem3')}</li>
              <li>{t('privacyPolicy.infoItem4')}</li>
              <li>{t('privacyPolicy.infoItem5')}</li>
              <li>{t('privacyPolicy.infoItem6')}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('privacyPolicy.howWeUseInformation')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('privacyPolicy.howWeUseP1')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>{t('privacyPolicy.useItem1')}</li>
              <li>{t('privacyPolicy.useItem2')}</li>
              <li>{t('privacyPolicy.useItem3')}</li>
              <li>{t('privacyPolicy.useItem4')}</li>
            </ul>
            <p>{t('privacyPolicy.howWeUseP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('privacyPolicy.cookies')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('privacyPolicy.cookiesP1')}</p>
            <p>{t('privacyPolicy.cookiesP2')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>{t('privacyPolicy.analyticsCookies')}</strong>{' '}
                {t('privacyPolicy.analyticsCookiesText')}
              </li>
              <li>
                <strong>{t('privacyPolicy.advertisingCookies')}</strong>{' '}
                {t('privacyPolicy.advertisingCookiesText')}
              </li>
            </ul>
            <p>{t('privacyPolicy.cookiesP3')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('privacyPolicy.thirdPartyServices')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>{t('privacyPolicy.thirdPartyP1')}</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>{t('privacyPolicy.ga4')}</strong>{' '}
                {t('privacyPolicy.ga4Text')}{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  policies.google.com/privacy
                </a>
                .
              </li>
              <li>
                <strong>{t('privacyPolicy.adSense')}</strong>{' '}
                {t('privacyPolicy.adSenseText')}{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {t('privacyPolicy.googleAdsSettings')}
                </a>
                .
              </li>
            </ul>
            <p>{t('privacyPolicy.thirdPartyP2')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('privacyPolicy.contactHeading')}
          </h2>
          <div className="mt-4 space-y-3">
            <p>
              {t('privacyPolicy.contactText')}{' '}
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

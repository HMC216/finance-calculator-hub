import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}/about`;
  }

  return {
    title: t('about.metaTitle'),
    description: t('about.metaDescription'),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/about`,
      languages,
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {t('about.title')}
      </h1>

      <section className="mt-8 space-y-4 text-gray-700 leading-relaxed">
        <p>{t('about.intro')}</p>
        <p>{t('about.mission')}</p>
        <p>{t('about.transparency')}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{t('about.teamHeading')}</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="font-medium text-gray-900">{t('about.teamName')}</p>
          <p className="mt-1 text-sm text-gray-500">
            {t('about.teamRole')}
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {t('about.teamBio')}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{t('about.contactHeading')}</h2>
        <div className="mt-4 space-y-2 text-gray-700">
          <p>{t('about.contactText')}</p>
          <p>
            {t('about.contactEmail')}{' '}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {SITE_CONFIG.email}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

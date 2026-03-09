import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation.ts';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t('seo.home.title');
  const description = t('seo.home.description');

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_CONFIG.url}/${loc}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}`,
      languages,
    },
    openGraph: {
      title,
      description: t('seo.home.ogDescription'),
      url: `${SITE_CONFIG.url}/${locale}`,
      siteName: t('common.siteName'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description: t('seo.home.ogDescription'),
    },
  };
}

const CALCULATOR_ICONS = [
  (
    <svg key="ci" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  (
    <svg key="ig" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  (
    <svg key="ret" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
];

const CALCULATOR_CONFIGS = [
  { titleKey: 'home.retirementTitle', descKey: 'home.retirementDescription', href: '/retirement-calculator' as const, iconIndex: 2 },
  { titleKey: 'home.investmentGrowthTitle', descKey: 'home.investmentGrowthDescription', href: '/investment-growth-calculator' as const, iconIndex: 1 },
  { titleKey: 'home.compoundInterestTitle', descKey: 'home.compoundInterestDescription', href: '/compound-interest-calculator' as const, iconIndex: 0 },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
          {t('home.subtitle', { credential: SITE_CONFIG.author.credential })}
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          {t('common.builtByCFA')}
        </div>
      </section>

      {/* Calculator Cards */}
      <section aria-labelledby="calculators-heading">
        <h2 id="calculators-heading" className="sr-only">
          {t('home.availableCalculators')}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CALCULATOR_CONFIGS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
            >
              <div className="mb-4">{CALCULATOR_ICONS[calc.iconIndex]}</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                {t(calc.titleKey)}
              </h3>
              <p className="mb-4 flex-1 text-sm text-gray-600">
                {t(calc.descKey)}
              </p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                {t('common.openCalculator')}
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="mt-16 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          {t('home.trustTitle')}
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-gray-600">
          {t('home.trustDescription', { credential: SITE_CONFIG.author.credential })}
        </p>
      </section>
    </div>
  );
}

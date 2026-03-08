import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation.ts';

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-300">{t('notFound.title')}</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {t('notFound.heading')}
      </h2>
      <p className="mb-8 max-w-md text-gray-600">
        {t('notFound.description')}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/compound-interest-calculator"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('nav.compoundInterest')}
        </Link>
        <Link
          href="/investment-growth-calculator"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-50"
        >
          {t('nav.investmentGrowth')}
        </Link>
        <Link
          href="/retirement-calculator"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-50"
        >
          {t('nav.retirement')}
        </Link>
      </div>
      <Link
        href="/"
        className="mt-6 text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        {t('notFound.backToHome')}
      </Link>
    </div>
  );
}

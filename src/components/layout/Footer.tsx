'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation.ts';
import { SITE_CONFIG } from '@/lib/constants.ts';

const FOOTER_LINK_KEYS = [
  { href: '/compound-interest-calculator' as const, key: 'nav.compoundInterest' },
  { href: '/investment-growth-calculator' as const, key: 'nav.investmentGrowth' },
  { href: '/retirement-calculator' as const, key: 'nav.retirement' },
];

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-base font-bold text-gray-900 transition-colors hover:text-blue-700"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-1 text-xs text-gray-500">
              {t('footer.tagline')}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              <svg
                className="h-3 w-3"
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
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('nav.calculators')}
            </h3>
            <ul className="space-y-1.5">
              {FOOTER_LINK_KEYS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-400">
          <p>
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation.ts';
import { SITE_CONFIG } from '@/lib/constants.ts';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.tsx';
import CurrencySwitcher from '@/components/layout/CurrencySwitcher.tsx';

const NAV_LINK_KEYS = [
  { href: '/retirement-calculator' as const, key: 'nav.retirement' },
  { href: '/investment-growth-calculator' as const, key: 'nav.investmentGrowth' },
  { href: '/compound-interest-calculator' as const, key: 'nav.compoundInterest' },
];

export default function Header() {
  const t = useTranslations();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:gap-0">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 transition-colors hover:text-blue-700"
        >
          {SITE_CONFIG.name}
        </Link>
        <div className="flex items-center gap-3">
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1 text-sm">
              {NAV_LINK_KEYS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <CurrencySwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}

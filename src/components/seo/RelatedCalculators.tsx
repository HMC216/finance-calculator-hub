'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation.ts';
import type { CalculatorType } from '@/lib/calculations/types.ts';

interface CalculatorInfo {
  type: CalculatorType;
  titleKey: string;
  descKey: string;
  href: string;
}

const ALL_CALCULATORS: CalculatorInfo[] = [
  {
    type: 'compound-interest',
    titleKey: 'relatedCalculators.compoundInterestTitle',
    descKey: 'relatedCalculators.compoundInterestDescription',
    href: '/compound-interest-calculator',
  },
  {
    type: 'investment-growth',
    titleKey: 'relatedCalculators.investmentGrowthTitle',
    descKey: 'relatedCalculators.investmentGrowthDescription',
    href: '/investment-growth-calculator',
  },
  {
    type: 'retirement',
    titleKey: 'relatedCalculators.retirementTitle',
    descKey: 'relatedCalculators.retirementDescription',
    href: '/retirement-calculator',
  },
];

interface RelatedCalculatorsProps {
  current: CalculatorType;
}

export default function RelatedCalculators({ current }: RelatedCalculatorsProps) {
  const t = useTranslations();
  const related = ALL_CALCULATORS.filter((c) => c.type !== current);

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2
        id="related-heading"
        className="mb-4 text-xl font-bold text-gray-900"
      >
        {t('relatedCalculators.heading')}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {related.map((calc) => (
          <Link
            key={calc.type}
            href={calc.href}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
          >
            <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              {t(calc.titleKey)}
            </h3>
            <p className="text-sm text-gray-500">
              {t(calc.descKey)}
            </p>
            <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
              {t('common.tryIt')}
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
  );
}

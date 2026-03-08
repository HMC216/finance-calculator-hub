'use client';

import { useTranslations } from 'next-intl';
import type { ScenarioResult } from '@/lib/calculations/types.ts';
import { formatCurrency, formatPercent } from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';

interface ScenarioCompareProps {
  scenarios: ScenarioResult[];
  targetAmount: number | null;
}

const scenarioStyles = {
  Conservative: {
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    badge: 'bg-slate-200 text-slate-700',
    accent: 'text-slate-700',
  },
  Base: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    badge: 'bg-blue-200 text-blue-800',
    accent: 'text-blue-700',
  },
  Aggressive: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    badge: 'bg-green-200 text-green-800',
    accent: 'text-green-700',
  },
} as const;

const SCENARIO_LABEL_KEYS = {
  Conservative: 'scenario.conservative',
  Base: 'scenario.base',
  Aggressive: 'scenario.aggressive',
} as const;

export default function ScenarioCompare({
  scenarios,
  targetAmount,
}: ScenarioCompareProps) {
  const t = useTranslations();

  if (scenarios.length === 0) return null;

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      role="region"
      aria-label={t('scenario.comparisonAriaLabel')}
    >
      {scenarios.map((scenario) => {
        const styles = scenarioStyles[scenario.label];
        const isBase = scenario.label === 'Base';
        const translatedLabel = t(SCENARIO_LABEL_KEYS[scenario.label]);

        return (
          <div
            key={scenario.label}
            className={cn(
              'rounded-xl border p-5 transition-shadow',
              styles.border,
              styles.bg,
              isBase ? 'shadow-md ring-2 ring-blue-400/30 md:scale-[1.03]' : 'hover:shadow-md',
            )}
            role="figure"
            aria-label={`${translatedLabel} scenario: ${formatCurrency(scenario.result.finalBalance)} at ${formatPercent(scenario.returnRate)} return`}
          >
            {/* Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn(
                  'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  styles.badge,
                )}
              >
                {translatedLabel}
              </span>
              {isBase && (
                <span className="text-xs font-medium text-blue-500">
                  {t('common.expected')}
                </span>
              )}
            </div>

            {/* Return Rate */}
            <p className="mb-1 text-xs text-gray-500">{t('results.annualReturnLabel')}</p>
            <p className={cn('mb-4 text-lg font-semibold', styles.accent)}>
              {formatPercent(scenario.returnRate)}
            </p>

            {/* Final Balance */}
            <p className="mb-1 text-xs text-gray-500">{t('results.finalBalance')}</p>
            <p className="mb-4 text-2xl font-bold font-mono text-gray-900">
              {formatCurrency(scenario.result.finalBalance)}
            </p>

            {/* Total Contributions & Interest */}
            <div className="mb-4 space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{t('results.contributions')}</span>
                <span className="font-mono">
                  {formatCurrency(scenario.result.totalContributions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('results.interestEarned')}</span>
                <span className="font-mono text-green-600">
                  {formatCurrency(scenario.result.totalInterest)}
                </span>
              </div>
            </div>

            {/* Years to Target */}
            {targetAmount !== null && (
              <div className="border-t border-gray-200 pt-3">
                <p className="mb-0.5 text-xs text-gray-500">{t('results.yearsToTarget')}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {scenario.yearsToTarget !== null
                    ? t('results.yearsToTargetValue', { count: scenario.yearsToTarget })
                    : t('common.notReached')}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

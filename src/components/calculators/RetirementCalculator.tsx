'use client';

import { useTranslations } from 'next-intl';
import { useRetirementCalculator } from '@/hooks/useCalculator.ts';
import { CALCULATOR_LIMITS } from '@/lib/constants.ts';
import { formatCurrency } from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';
import InputField from '@/components/ui/InputField.tsx';
import ResultCard from '@/components/ui/ResultCard.tsx';
import GrowthChart from '@/components/ui/GrowthChart.tsx';
import InterpretationText from '@/components/ui/InterpretationText.tsx';
import YearlyTable from '@/components/ui/YearlyTable.tsx';
import ShareButton from '@/components/ui/ShareButton.tsx';

const limits = CALCULATOR_LIMITS.retirement;

const READINESS_STYLES = {
  on_track: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-800',
    badgeColor: 'bg-green-200 text-green-900',
    icon: (
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  close: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-200 text-yellow-900',
    icon: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  behind: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-200 text-red-900',
    icon: (
      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  no_target: {
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    badgeColor: 'bg-gray-200 text-gray-800',
    icon: (
      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
} as const;

const READINESS_LABEL_KEYS = {
  on_track: 'retirement.onTrack',
  close: 'retirement.almostThere',
  behind: 'retirement.behindSchedule',
  no_target: 'retirement.noTarget',
} as const;

const READINESS_DESC_KEYS = {
  on_track: 'retirement.onTrackDescription',
  close: 'retirement.almostThereDescription',
  behind: 'retirement.behindScheduleDescription',
  no_target: 'retirement.noTargetDescription',
} as const;

export default function RetirementCalculator() {
  const t = useTranslations();
  const { inputs, setInputs, result, interpretations } =
    useRetirementCalculator();

  const styles = READINESS_STYLES[result.readiness];
  const readinessLabel = t(READINESS_LABEL_KEYS[result.readiness]);
  const readinessDescription = t(READINESS_DESC_KEYS[result.readiness]);

  return (
    <div className="space-y-8">
      {/* Input Fields */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          {t('common.calculatorInputs')}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="ret-age"
            label={t('calculatorInputs.currentAge')}
            value={inputs.currentAge}
            onChange={(v) => setInputs({ age: v })}
            min={limits.currentAge.min}
            max={limits.currentAge.max}
            step={limits.currentAge.step}
            tooltip={t('tooltips.currentAge')}
            showSlider={true}
          />
          <InputField
            id="ret-retire-age"
            label={t('calculatorInputs.retirementAge')}
            value={inputs.retirementAge}
            onChange={(v) => setInputs({ retire: v })}
            min={limits.retirementAge.min}
            max={limits.retirementAge.max}
            step={limits.retirementAge.step}
            tooltip={t('tooltips.retirementAge')}
            showSlider={true}
          />
          <InputField
            id="ret-savings"
            label={t('calculatorInputs.currentSavings')}
            value={inputs.currentSavings}
            onChange={(v) => setInputs({ savings: v })}
            min={limits.currentSavings.min}
            max={limits.currentSavings.max}
            step={limits.currentSavings.step}
            prefix="$"
            tooltip={t('tooltips.currentSavings')}
            showSlider={true}
          />
          <InputField
            id="ret-monthly"
            label={t('calculatorInputs.monthlyContribution')}
            value={inputs.monthlyContribution}
            onChange={(v) => setInputs({ monthly: v })}
            min={limits.monthlyContribution.min}
            max={limits.monthlyContribution.max}
            step={limits.monthlyContribution.step}
            prefix="$"
            tooltip={t('tooltips.monthlyContributionRetirement')}
            showSlider={true}
          />
          <InputField
            id="ret-return"
            label={t('calculatorInputs.annualReturn')}
            value={inputs.annualReturn}
            onChange={(v) => setInputs({ return: v })}
            min={limits.annualReturn.min}
            max={limits.annualReturn.max}
            step={limits.annualReturn.step}
            suffix="%"
            tooltip={t('tooltips.annualReturnRetirement')}
            showSlider={true}
          />
          <InputField
            id="ret-goal"
            label={t('calculatorInputs.desiredRetirementFund')}
            value={inputs.desiredFund ?? 0}
            onChange={(v) => setInputs({ goal: v > 0 ? v : null })}
            min={limits.desiredFund.min}
            max={limits.desiredFund.max}
            step={limits.desiredFund.step}
            prefix="$"
            tooltip={t('tooltips.desiredRetirementFund')}
            showSlider={true}
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ResultCard
          label={t('results.estimatedBalanceAtRetirement')}
          value={result.estimatedBalance}
          format="currency"
          variant="primary"
        />
        <ResultCard
          label={t('results.totalContributions')}
          value={result.totalContributions}
          format="currency"
          variant="secondary"
        />
        <ResultCard
          label={t('results.totalInterest')}
          value={result.totalInterest}
          format="currency"
          variant="highlight"
        />
      </div>

      {/* Retirement Readiness Card */}
      <div
        className={cn(
          'rounded-xl border p-5',
          styles.borderColor,
          styles.bgColor,
        )}
        role="status"
        aria-label={t('retirement.readinessAriaLabel', { status: readinessLabel })}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  styles.badgeColor,
                )}
              >
                {readinessLabel}
              </span>
            </div>
            <p className={cn('text-sm', styles.textColor)}>
              {readinessDescription}
            </p>
            {result.gap !== null && result.gap > 0 && (
              <p className={cn('mt-1 text-sm font-medium', styles.textColor)}>
                {t('retirement.gap', { amount: formatCurrency(result.gap) })}
                {result.requiredAdditionalMonthly !== null &&
                  result.requiredAdditionalMonthly > 0 && (
                    <span className="font-normal">
                      {' '}
                      &mdash; {t('retirement.saveMore', { amount: formatCurrency(result.requiredAdditionalMonthly) })}
                    </span>
                  )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('results.savingsGrowthByAge')}
        </h2>
        <GrowthChart
          data={result.yearlyData}
          mode="stacked-area"
          xAxisLabel={t('chart.age')}
        />
      </div>

      {/* Interpretation */}
      <InterpretationText items={interpretations} />

      {/* Yearly Table */}
      <YearlyTable data={result.yearlyData} />

      {/* Share */}
      <div className="flex justify-end">
        <ShareButton calculatorType="retirement" />
      </div>
    </div>
  );
}

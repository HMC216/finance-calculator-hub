'use client';

import { useTranslations } from 'next-intl';
import { useRetirementCalculator } from '@/hooks/useCalculator.ts';
import { CALCULATOR_LIMITS } from '@/lib/constants.ts';
import { formatCurrency } from '@/lib/formatters.ts';
import { useCurrency } from '@/lib/currency/CurrencyContext.tsx';
import { currencyConfig } from '@/lib/currency/config.ts';
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
  const { currency } = useCurrency();
  const currencySymbol = currencyConfig[currency].symbol;
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
            prefix={currencySymbol}
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
            prefix={currencySymbol}
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
            prefix={currencySymbol}
            tooltip={t('tooltips.desiredRetirementFund')}
            showSlider={true}
          />
          <InputField
            id="ret-expenses"
            label={t('calculatorInputs.annualExpenses')}
            value={inputs.annualExpenses ?? 0}
            onChange={(v) => setInputs({ expenses: v > 0 ? v : null })}
            min={limits.annualExpenses.min}
            max={limits.annualExpenses.max}
            step={limits.annualExpenses.step}
            prefix={currencySymbol}
            tooltip={t('tooltips.annualExpenses')}
            showSlider={true}
          />
          <InputField
            id="ret-wr"
            label={t('calculatorInputs.withdrawalRate')}
            value={inputs.withdrawalRate}
            onChange={(v) => setInputs({ wr: v })}
            min={limits.withdrawalRate.min}
            max={limits.withdrawalRate.max}
            step={limits.withdrawalRate.step}
            suffix="%"
            tooltip={t('tooltips.withdrawalRate')}
            showSlider={true}
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ResultCard
          label={t('results.estimatedBalanceAtRetirement')}
          value={result.estimatedBalance}
          format="currency"
          variant="primary"
        />
        <ResultCard
          label={t('results.monthlyRetirementIncome')}
          value={result.monthlyRetirementIncome}
          format="currency"
          variant="highlight"
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
          variant="secondary"
        />
      </div>

      {/* FIRE Number Section */}
      {result.fireNumber !== null && result.fireProgress !== null && (
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <h3 className="text-lg font-semibold text-orange-900">
              {t('retirement.fireNumber')}
            </h3>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-orange-800">
              {formatCurrency(result.fireNumber, currency)}
            </span>
            <span className="text-sm text-orange-600">
              {t('retirement.fireTargetLabel', { rate: inputs.withdrawalRate })}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-orange-700">{t('retirement.fireProgress')}</span>
              <span className="font-semibold text-orange-900">
                {Math.round(result.fireProgress)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-orange-200">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  result.fireProgress >= 100
                    ? 'bg-green-500'
                    : result.fireProgress >= 75
                      ? 'bg-orange-500'
                      : result.fireProgress >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-400',
                )}
                style={{ width: `${Math.min(100, result.fireProgress)}%` }}
              />
            </div>
          </div>
          {result.fireProgress < 100 && (
            <p className="mt-2 text-sm text-orange-700">
              {t('retirement.fireGap', {
                amount: formatCurrency(result.fireNumber - result.estimatedBalance, currency),
              })}
            </p>
          )}
        </div>
      )}

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
                {t('retirement.gap', { amount: formatCurrency(result.gap, currency) })}
                {result.requiredAdditionalMonthly !== null &&
                  result.requiredAdditionalMonthly > 0 && (
                    <span className="font-normal">
                      {' '}
                      &mdash; {t('retirement.saveMore', { amount: formatCurrency(result.requiredAdditionalMonthly, currency) })}
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

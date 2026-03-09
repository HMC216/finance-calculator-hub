'use client';

import { useTranslations } from 'next-intl';
import { useInvestmentGrowthCalculator } from '@/hooks/useCalculator.ts';
import { CALCULATOR_LIMITS } from '@/lib/constants.ts';
import type { CompoundFrequency } from '@/lib/calculations/types.ts';
import { useCurrency } from '@/lib/currency/CurrencyContext.tsx';
import { currencyConfig } from '@/lib/currency/config.ts';
import { formatCurrency } from '@/lib/formatters.ts';
import InputField from '@/components/ui/InputField.tsx';
import ScenarioCompare from '@/components/ui/ScenarioCompare.tsx';
import GrowthChart from '@/components/ui/GrowthChart.tsx';
import InterpretationText from '@/components/ui/InterpretationText.tsx';
import YearlyTable from '@/components/ui/YearlyTable.tsx';
import ShareButton from '@/components/ui/ShareButton.tsx';

const limits = CALCULATOR_LIMITS.investmentGrowth;

export default function InvestmentGrowthCalculator() {
  const t = useTranslations();
  const { currency } = useCurrency();
  const currencySymbol = currencyConfig[currency].symbol;
  const { inputs, setInputs, result, interpretations } =
    useInvestmentGrowthCalculator();

  const FREQUENCY_OPTIONS: { value: CompoundFrequency; label: string }[] = [
    { value: 'monthly', label: t('calculatorInputs.monthly') },
    { value: 'quarterly', label: t('calculatorInputs.quarterly') },
    { value: 'annually', label: t('calculatorInputs.annually') },
  ];

  // Base scenario for the yearly table
  const baseScenario = result.scenarios[1];

  return (
    <div className="space-y-8">
      {/* Input Fields */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          {t('common.calculatorInputs')}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="ig-initial"
            label={t('calculatorInputs.initialInvestment')}
            value={inputs.initialAmount}
            onChange={(v) => setInputs({ init: v })}
            min={limits.initialAmount.min}
            max={limits.initialAmount.max}
            step={limits.initialAmount.step}
            prefix={currencySymbol}
            tooltip={t('tooltips.initialInvestment')}
            showSlider={true}
          />
          <InputField
            id="ig-monthly"
            label={t('calculatorInputs.monthlyContribution')}
            value={inputs.monthlyContribution}
            onChange={(v) => setInputs({ monthly: v })}
            min={limits.monthlyContribution.min}
            max={limits.monthlyContribution.max}
            step={limits.monthlyContribution.step}
            prefix={currencySymbol}
            tooltip={t('tooltips.monthlyContribution')}
            showSlider={true}
          />
          <InputField
            id="ig-years"
            label={t('calculatorInputs.investmentPeriod')}
            value={inputs.years}
            onChange={(v) => setInputs({ years: v })}
            min={limits.years.min}
            max={limits.years.max}
            step={limits.years.step}
            suffix={t('calculatorInputs.years')}
            tooltip={t('tooltips.investmentPeriod')}
            showSlider={true}
          />
          <InputField
            id="ig-return"
            label={t('calculatorInputs.expectedAnnualReturn')}
            value={inputs.annualReturn}
            onChange={(v) => setInputs({ return: v })}
            min={limits.annualReturn.min}
            max={limits.annualReturn.max}
            step={limits.annualReturn.step}
            suffix="%"
            tooltip={t('tooltips.expectedAnnualReturn')}
            showSlider={true}
          />

          {/* Compound Frequency Select */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="ig-frequency"
              className="text-sm font-medium text-gray-700"
            >
              {t('calculatorInputs.compoundFrequency')}
            </label>
            <select
              id="ig-frequency"
              value={inputs.compoundFrequency}
              onChange={(e) =>
                setInputs({ freq: e.target.value as CompoundFrequency })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <InputField
            id="ig-target"
            label={t('calculatorInputs.targetAmount')}
            value={inputs.targetAmount ?? 0}
            onChange={(v) => setInputs({ target: v > 0 ? v : null })}
            min={limits.targetAmount.min}
            max={limits.targetAmount.max}
            step={limits.targetAmount.step}
            prefix={currencySymbol}
            tooltip={t('tooltips.targetAmount')}
            showSlider={true}
          />
          <InputField
            id="ig-fees"
            label={t('calculatorInputs.expenseRatio')}
            value={inputs.expenseRatio}
            onChange={(v) => setInputs({ fees: v })}
            min={limits.expenseRatio.min}
            max={limits.expenseRatio.max}
            step={limits.expenseRatio.step}
            suffix="%"
            tooltip={t('tooltips.expenseRatio')}
            showSlider={true}
          />
        </div>
      </div>

      {/* Scenario Comparison */}
      <ScenarioCompare
        scenarios={[...result.scenarios]}
        targetAmount={inputs.targetAmount}
      />

      {/* Fee Impact Analysis */}
      {result.feeImpact !== null && (
        <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900">
              {t('results.feeImpactTitle')}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/70 p-4">
              <p className="mb-1 text-xs text-gray-500">{t('results.withoutFees')}</p>
              <p className="font-mono text-xl font-bold text-green-700">
                {formatCurrency(result.feeImpact.balanceWithoutFees, currency)}
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-4">
              <p className="mb-1 text-xs text-gray-500">
                {t('results.withFees', { rate: inputs.expenseRatio })}
              </p>
              <p className="font-mono text-xl font-bold text-gray-700">
                {formatCurrency(result.feeImpact.balanceWithFees, currency)}
              </p>
            </div>
            <div className="rounded-lg bg-red-100/70 p-4">
              <p className="mb-1 text-xs text-red-600">{t('results.totalFeesLost')}</p>
              <p className="font-mono text-xl font-bold text-red-700">
                −{formatCurrency(result.feeImpact.totalFeesLost, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Growth Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('results.scenarioGrowthComparison')}
        </h2>
        <GrowthChart
          data={baseScenario.result.yearlyData}
          mode="multi-line"
          scenarios={[...result.scenarios]}
        />
      </div>

      {/* Interpretation */}
      <InterpretationText items={interpretations} />

      {/* Yearly Table (Base Scenario) */}
      <YearlyTable data={baseScenario.result.yearlyData} />

      {/* Share */}
      <div className="flex justify-end">
        <ShareButton calculatorType="investment-growth" />
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { useCompoundInterestCalculator } from '@/hooks/useCalculator.ts';
import { CALCULATOR_LIMITS } from '@/lib/constants.ts';
import type { CompoundFrequency } from '@/lib/calculations/types.ts';
import InputField from '@/components/ui/InputField.tsx';
import ResultCard from '@/components/ui/ResultCard.tsx';
import GrowthChart from '@/components/ui/GrowthChart.tsx';
import InterpretationText from '@/components/ui/InterpretationText.tsx';
import YearlyTable from '@/components/ui/YearlyTable.tsx';
import ShareButton from '@/components/ui/ShareButton.tsx';

const limits = CALCULATOR_LIMITS.compoundInterest;

export default function CompoundInterestCalculator() {
  const t = useTranslations();
  const { inputs, setInputs, result, interpretations } =
    useCompoundInterestCalculator();

  const FREQUENCY_OPTIONS: { value: CompoundFrequency; label: string }[] = [
    { value: 'monthly', label: t('calculatorInputs.monthly') },
    { value: 'quarterly', label: t('calculatorInputs.quarterly') },
    { value: 'annually', label: t('calculatorInputs.annually') },
  ];

  return (
    <div className="space-y-8">
      {/* Input Fields */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          {t('common.calculatorInputs')}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="ci-initial"
            label={t('calculatorInputs.initialInvestment')}
            value={inputs.initialAmount}
            onChange={(v) => setInputs({ init: v })}
            min={limits.initialAmount.min}
            max={limits.initialAmount.max}
            step={limits.initialAmount.step}
            prefix="$"
            tooltip={t('tooltips.initialInvestment')}
            showSlider={true}
          />
          <InputField
            id="ci-monthly"
            label={t('calculatorInputs.monthlyContribution')}
            value={inputs.monthlyContribution}
            onChange={(v) => setInputs({ monthly: v })}
            min={limits.monthlyContribution.min}
            max={limits.monthlyContribution.max}
            step={limits.monthlyContribution.step}
            prefix="$"
            tooltip={t('tooltips.monthlyContribution')}
            showSlider={true}
          />
          <InputField
            id="ci-years"
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
            id="ci-return"
            label={t('calculatorInputs.annualReturn')}
            value={inputs.annualReturn}
            onChange={(v) => setInputs({ return: v })}
            min={limits.annualReturn.min}
            max={limits.annualReturn.max}
            step={limits.annualReturn.step}
            suffix="%"
            tooltip={t('tooltips.annualReturn')}
            showSlider={true}
          />

          {/* Compound Frequency Select */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="ci-frequency"
              className="text-sm font-medium text-gray-700"
            >
              {t('calculatorInputs.compoundFrequency')}
            </label>
            <select
              id="ci-frequency"
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
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ResultCard
          label={t('results.finalBalance')}
          value={result.finalBalance}
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
        <ResultCard
          label={t('results.interestPercent')}
          value={result.interestPercentage}
          format="percent"
          variant="secondary"
        />
      </div>

      {/* Growth Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('common.growthOverTime')}
        </h2>
        <GrowthChart data={result.yearlyData} mode="stacked-area" />
      </div>

      {/* Interpretation */}
      <InterpretationText items={interpretations} />

      {/* Yearly Table */}
      <YearlyTable data={result.yearlyData} />

      {/* Share */}
      <div className="flex justify-end">
        <ShareButton calculatorType="compound-interest" />
      </div>
    </div>
  );
}

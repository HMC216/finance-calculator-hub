import type {
  InvestmentGrowthInputs,
  InvestmentGrowthResult,
  FeeImpactResult,
  ScenarioResult,
  CompoundInterestResult,
} from './types.ts';
import { calculateCompoundInterest } from './compound-interest.ts';
import { clampNumber, compoundFrequencyToN, roundToCents } from './shared.ts';

function findYearsToTarget(
  inputs: InvestmentGrowthInputs,
  annualReturn: number,
  targetAmount: number
): number | null {
  if (targetAmount <= 0) return null;

  const monthlyRate = annualReturn / 100 / 12;
  let balance = inputs.initialAmount;

  for (let month = 1; month <= inputs.years * 12; month++) {
    if (monthlyRate > 0) {
      balance *= (1 + monthlyRate);
    }
    balance += inputs.monthlyContribution;

    if (balance >= targetAmount) {
      return month;
    }
  }
  return null;
}

function calculateRequiredMonthly(
  targetAmount: number,
  initialAmount: number,
  annualReturn: number,
  years: number
): number {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    const needed = targetAmount - initialAmount;
    return needed > 0 ? roundToCents(needed / totalMonths) : 0;
  }

  // FV of lump sum
  const fvLump = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
  const remaining = targetAmount - fvLump;

  if (remaining <= 0) return 0;

  // PMT = remaining * r / ((1+r)^n - 1)
  const pmt = remaining * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return roundToCents(Math.max(0, pmt));
}

export function calculateInvestmentGrowth(
  inputs: InvestmentGrowthInputs
): InvestmentGrowthResult {
  const offset = 3;
  const conservativeReturn = clampNumber(inputs.annualReturn - offset, 0, 25);
  const aggressiveReturn = clampNumber(inputs.annualReturn + offset, 0, 25);

  const scenarioRates: Array<{ label: ScenarioResult['label']; rate: number }> = [
    { label: 'Conservative', rate: conservativeReturn },
    { label: 'Base', rate: inputs.annualReturn },
    { label: 'Aggressive', rate: aggressiveReturn },
  ];

  const scenarios = scenarioRates.map(({ label, rate }) => {
    const result = calculateCompoundInterest({
      ...inputs,
      annualReturn: rate,
    });

    let yearsToTarget: number | null = null;
    if (inputs.targetAmount !== null && inputs.targetAmount > 0) {
      const months = findYearsToTarget(inputs, rate, inputs.targetAmount);
      yearsToTarget = months !== null ? months : null;
    }

    return { label, returnRate: rate, result, yearsToTarget } as ScenarioResult;
  }) as [ScenarioResult, ScenarioResult, ScenarioResult];

  // Calculate required monthly if base scenario falls short
  let requiredMonthly: number | null = null;
  if (
    inputs.targetAmount !== null &&
    inputs.targetAmount > 0 &&
    scenarios[1].result.finalBalance < inputs.targetAmount
  ) {
    requiredMonthly = calculateRequiredMonthly(
      inputs.targetAmount,
      inputs.initialAmount,
      inputs.annualReturn,
      inputs.years
    );
  }

  // Fee impact analysis
  let feeImpact: FeeImpactResult | null = null;
  if (inputs.expenseRatio > 0) {
    const balanceWithoutFees = scenarios[1].result.finalBalance; // base scenario, no fees
    const effectiveReturn = Math.max(0, inputs.annualReturn - inputs.expenseRatio);
    const withFeesResult = calculateCompoundInterest({
      ...inputs,
      annualReturn: effectiveReturn,
    });
    feeImpact = {
      balanceWithFees: withFeesResult.finalBalance,
      balanceWithoutFees,
      totalFeesLost: roundToCents(balanceWithoutFees - withFeesResult.finalBalance),
    };
  }

  return { scenarios, requiredMonthly, feeImpact };
}

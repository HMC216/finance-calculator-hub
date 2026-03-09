import type { RetirementInputs, RetirementResult, YearlyDataPoint } from './types.ts';
import { clampNumber, roundToCents } from './shared.ts';

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const currentAge = clampNumber(inputs.currentAge, 18, 80);
  const retirementAge = clampNumber(inputs.retirementAge, currentAge + 1, 85);
  const currentSavings = clampNumber(inputs.currentSavings, 0, 50_000_000);
  const monthlyContribution = clampNumber(inputs.monthlyContribution, 0, 100_000);
  const annualReturn = clampNumber(inputs.annualReturn, 0, 20);

  const yearsToRetirement = retirementAge - currentAge;
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = yearsToRetirement * 12;

  const yearlyData: YearlyDataPoint[] = [];
  let balance = currentSavings;
  let totalContributed = currentSavings;

  if (monthlyRate === 0) {
    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearContribution = monthlyContribution * 12;
      totalContributed += yearContribution;
      balance += yearContribution;
      yearlyData.push({
        year: currentAge + year,
        contributions: roundToCents(totalContributed),
        interestEarned: 0,
        totalBalance: roundToCents(balance),
      });
    }
  } else {
    let monthInYear = 0;
    for (let month = 1; month <= totalMonths; month++) {
      balance *= (1 + monthlyRate);
      balance += monthlyContribution;
      totalContributed += monthlyContribution;
      monthInYear++;

      if (monthInYear === 12) {
        const currentYear = currentAge + Math.round(month / 12);
        yearlyData.push({
          year: currentYear,
          contributions: roundToCents(totalContributed),
          interestEarned: roundToCents(balance - totalContributed),
          totalBalance: roundToCents(balance),
        });
        monthInYear = 0;
      }
    }
  }

  const estimatedBalance = roundToCents(balance);
  const totalContributions = roundToCents(totalContributed);
  const totalInterest = roundToCents(estimatedBalance - totalContributions);

  // Gap analysis
  let gap: number | null = null;
  let requiredAdditionalMonthly: number | null = null;
  let readiness: RetirementResult['readiness'] = 'no_target';

  if (inputs.desiredFund !== null && inputs.desiredFund > 0) {
    gap = roundToCents(inputs.desiredFund - estimatedBalance);

    if (gap <= 0) {
      readiness = 'on_track';
    } else {
      const gapPercent = gap / inputs.desiredFund;
      readiness = gapPercent < 0.1 ? 'close' : 'behind';

      // Calculate required additional monthly
      if (monthlyRate === 0) {
        requiredAdditionalMonthly = roundToCents(gap / totalMonths);
      } else {
        // PMT = FV * r / ((1+r)^n - 1)
        const pmt = gap * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        requiredAdditionalMonthly = roundToCents(Math.max(0, pmt));
      }
    }
  }

  // FIRE Number calculation
  let fireNumber: number | null = null;
  let fireProgress: number | null = null;
  const withdrawalRate = clampNumber(inputs.withdrawalRate, 1, 10);

  if (inputs.annualExpenses !== null && inputs.annualExpenses > 0) {
    fireNumber = roundToCents(inputs.annualExpenses / (withdrawalRate / 100));
    fireProgress = Math.min(100, (estimatedBalance / fireNumber) * 100);
  }

  // Monthly retirement income (based on withdrawal rate)
  const monthlyRetirementIncome = roundToCents(
    (estimatedBalance * (withdrawalRate / 100)) / 12,
  );

  return {
    estimatedBalance,
    totalContributions,
    totalInterest,
    yearlyData,
    gap,
    requiredAdditionalMonthly,
    readiness,
    fireNumber,
    monthlyRetirementIncome,
    fireProgress,
  };
}

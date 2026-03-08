import type { CompoundInterestInputs, CompoundInterestResult, YearlyDataPoint } from './types.ts';
import { clampNumber, compoundFrequencyToN, roundToCents } from './shared.ts';

export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestResult {
  const initialAmount = clampNumber(inputs.initialAmount, 0, 10_000_000);
  const monthlyContribution = clampNumber(inputs.monthlyContribution, 0, 100_000);
  const years = clampNumber(inputs.years, 1, 50);
  const annualReturn = clampNumber(inputs.annualReturn, 0, 25);
  const n = compoundFrequencyToN(inputs.compoundFrequency);

  const ratePerPeriod = annualReturn / 100 / n;
  const totalPeriods = n * years;
  const periodsPerMonth = n / 12;
  const contributionPerPeriod = monthlyContribution * (12 / n);

  const yearlyData: YearlyDataPoint[] = [];
  let balance = initialAmount;
  let totalContributed = initialAmount;

  if (ratePerPeriod === 0) {
    // 0% return: simple accumulation
    for (let year = 1; year <= years; year++) {
      const yearContribution = monthlyContribution * 12;
      totalContributed += yearContribution;
      balance += yearContribution;
      yearlyData.push({
        year,
        contributions: roundToCents(totalContributed),
        interestEarned: 0,
        totalBalance: roundToCents(balance),
      });
    }
  } else {
    // Period-by-period iteration
    let periodInYear = 0;
    const periodsPerYear = n;

    for (let period = 1; period <= totalPeriods; period++) {
      // Apply interest
      const interest = balance * ratePerPeriod;
      balance += interest;

      // Add contribution
      balance += contributionPerPeriod;
      totalContributed += contributionPerPeriod;

      periodInYear++;

      // Snapshot at year boundary
      if (periodInYear === periodsPerYear) {
        const currentYear = Math.round(period / periodsPerYear);
        yearlyData.push({
          year: currentYear,
          contributions: roundToCents(totalContributed),
          interestEarned: roundToCents(balance - totalContributed),
          totalBalance: roundToCents(balance),
        });
        periodInYear = 0;
      }
    }
  }

  const finalBalance = roundToCents(balance);
  const totalContributions = roundToCents(totalContributed);
  const totalInterest = roundToCents(finalBalance - totalContributions);
  const interestPercentage = finalBalance > 0
    ? roundToCents((totalInterest / finalBalance) * 100)
    : 0;

  return {
    finalBalance,
    totalContributions,
    totalInterest,
    interestPercentage,
    yearlyData,
  };
}

import type {
  InvestmentGrowthInputs,
  InvestmentGrowthResult,
  InterpretationItem,
} from '../calculations/types.ts';
import { formatCurrency, formatYearsMonths } from '../formatters.ts';
import type { CurrencyCode } from '../currency/config.ts';

/**
 * Generate interpretation items (translation keys + values) for investment growth results.
 */
export function generateInvestmentGrowthInterpretations(
  inputs: InvestmentGrowthInputs,
  result: InvestmentGrowthResult,
  currency: CurrencyCode = 'USD',
): InterpretationItem[] {
  const items: InterpretationItem[] = [];
  const fmt = (v: number) => formatCurrency(v, currency);

  const [conservative, base, aggressive] = result.scenarios;

  // 1. Main summary with base scenario
  items.push({
    key: 'interpretation.ig.baseSummary',
    values: {
      rate: inputs.annualReturn,
      total: fmt(base.result.finalBalance),
      years: inputs.years,
    },
  });

  // 2. Scenario spread
  const spread = aggressive.result.finalBalance - conservative.result.finalBalance;
  if (spread > 0) {
    items.push({
      key: 'interpretation.ig.scenarioSpread',
      values: {
        conservativeRate: conservative.returnRate,
        aggressiveRate: aggressive.returnRate,
        spread: fmt(spread),
        conservativeTotal: fmt(conservative.result.finalBalance),
        aggressiveTotal: fmt(aggressive.result.finalBalance),
      },
    });
  }

  // 3. Target info
  if (inputs.targetAmount !== null && inputs.targetAmount > 0) {
    const targetFormatted = fmt(inputs.targetAmount);

    if (base.yearsToTarget !== null) {
      items.push({
        key: 'interpretation.ig.targetReached',
        values: {
          target: targetFormatted,
          time: formatYearsMonths(base.yearsToTarget),
        },
      });
    } else if (result.requiredMonthly !== null) {
      items.push({
        key: 'interpretation.ig.targetRequiresMore',
        values: {
          target: targetFormatted,
          years: inputs.years,
          requiredMonthly: fmt(result.requiredMonthly),
        },
      });
    } else {
      items.push({
        key: 'interpretation.ig.targetWithinReach',
        values: {
          target: targetFormatted,
        },
      });
    }
  }

  // 4. Fee impact insight
  if (result.feeImpact !== null && result.feeImpact.totalFeesLost > 0) {
    items.push({
      key: 'interpretation.ig.feeImpact',
      values: {
        expenseRatio: inputs.expenseRatio,
        totalFeesLost: fmt(result.feeImpact.totalFeesLost),
        balanceWithFees: fmt(result.feeImpact.balanceWithFees),
        balanceWithoutFees: fmt(result.feeImpact.balanceWithoutFees),
      },
    });
  }

  return items;
}

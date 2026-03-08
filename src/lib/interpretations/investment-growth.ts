import type {
  InvestmentGrowthInputs,
  InvestmentGrowthResult,
  InterpretationItem,
} from '../calculations/types.ts';
import { formatCurrency, formatYearsMonths } from '../formatters.ts';

/**
 * Generate interpretation items (translation keys + values) for investment growth results.
 */
export function generateInvestmentGrowthInterpretations(
  inputs: InvestmentGrowthInputs,
  result: InvestmentGrowthResult,
): InterpretationItem[] {
  const items: InterpretationItem[] = [];

  const [conservative, base, aggressive] = result.scenarios;

  // 1. Main summary with base scenario
  items.push({
    key: 'interpretation.ig.baseSummary',
    values: {
      rate: inputs.annualReturn,
      total: formatCurrency(base.result.finalBalance),
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
        spread: formatCurrency(spread),
        conservativeTotal: formatCurrency(conservative.result.finalBalance),
        aggressiveTotal: formatCurrency(aggressive.result.finalBalance),
      },
    });
  }

  // 3. Target info
  if (inputs.targetAmount !== null && inputs.targetAmount > 0) {
    const targetFormatted = formatCurrency(inputs.targetAmount);

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
          requiredMonthly: formatCurrency(result.requiredMonthly),
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

  return items;
}

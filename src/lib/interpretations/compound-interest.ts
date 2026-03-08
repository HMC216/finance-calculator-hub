import type {
  CompoundInterestInputs,
  CompoundInterestResult,
  InterpretationItem,
} from '../calculations/types.ts';
import { calculateCompoundInterest } from '../calculations/compound-interest.ts';
import { formatCurrency } from '../formatters.ts';
import { ruleOf72 } from '../calculations/shared.ts';

/**
 * Generate interpretation items (translation keys + values) for compound interest results.
 */
export function generateCompoundInterestInterpretations(
  inputs: CompoundInterestInputs,
  result: CompoundInterestResult,
): InterpretationItem[] {
  const items: InterpretationItem[] = [];

  // 1. Main summary
  const totalFormatted = formatCurrency(result.finalBalance);
  const interestPct = result.interestPercentage.toFixed(0);

  if (inputs.monthlyContribution > 0) {
    items.push({
      key: 'interpretation.ci.summaryWithContributions',
      values: {
        monthly: formatCurrency(inputs.monthlyContribution),
        rate: inputs.annualReturn,
        years: inputs.years,
        initial: formatCurrency(inputs.initialAmount),
        total: totalFormatted,
        interestPct,
      },
    });
  } else {
    items.push({
      key: 'interpretation.ci.summaryWithoutContributions',
      values: {
        initial: formatCurrency(inputs.initialAmount),
        rate: inputs.annualReturn,
        years: inputs.years,
        total: totalFormatted,
        interestPct,
      },
    });
  }

  // 2. Rule of 72
  if (inputs.annualReturn > 0) {
    const doublingYears = ruleOf72(inputs.annualReturn);
    items.push({
      key: 'interpretation.ci.ruleOf72',
      values: {
        doublingYears: doublingYears.toFixed(1),
        rate: inputs.annualReturn,
      },
    });
  }

  // 3. Marginal impact: adding $100/month more
  if (inputs.monthlyContribution < 100_000) {
    const marginalInputs: CompoundInterestInputs = {
      ...inputs,
      monthlyContribution: inputs.monthlyContribution + 100,
    };
    const marginalResult = calculateCompoundInterest(marginalInputs);
    const delta = marginalResult.finalBalance - result.finalBalance;

    if (delta > 0) {
      items.push({
        key: 'interpretation.ci.marginalImpact',
        values: {
          delta: formatCurrency(delta),
        },
      });
    }
  }

  return items;
}

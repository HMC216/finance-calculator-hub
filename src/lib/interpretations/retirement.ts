import type {
  RetirementInputs,
  RetirementResult,
  InterpretationItem,
} from '../calculations/types.ts';
import { formatCurrency } from '../formatters.ts';
import type { CurrencyCode } from '../currency/config.ts';

/**
 * Generate interpretation items (translation keys + values) for retirement calculation results.
 */
export function generateRetirementInterpretations(
  inputs: RetirementInputs,
  result: RetirementResult,
  currency: CurrencyCode = 'USD',
): InterpretationItem[] {
  const items: InterpretationItem[] = [];
  const fmt = (v: number) => formatCurrency(v, currency);

  // 1. Main summary
  items.push({
    key: 'interpretation.ret.mainSummary',
    values: {
      retirementAge: inputs.retirementAge,
      balance: fmt(result.estimatedBalance),
    },
  });

  // 2. Readiness assessment
  switch (result.readiness) {
    case 'on_track': {
      items.push({
        key: 'interpretation.ret.onTrack',
        values: {
          goal: fmt(inputs.desiredFund!),
        },
      });
      break;
    }
    case 'close': {
      items.push({
        key: 'interpretation.ret.close',
        values: {
          goal: fmt(inputs.desiredFund!),
          gap: fmt(Math.abs(result.gap!)),
        },
      });
      break;
    }
    case 'behind': {
      items.push({
        key: 'interpretation.ret.behind',
        values: {
          goal: fmt(inputs.desiredFund!),
          gap: fmt(Math.abs(result.gap!)),
        },
      });
      break;
    }
    case 'no_target':
      items.push({
        key: 'interpretation.ret.noTarget',
        values: {},
      });
      break;
  }

  // 3. Gap closing info
  if (
    result.requiredAdditionalMonthly !== null &&
    result.requiredAdditionalMonthly > 0
  ) {
    items.push({
      key: 'interpretation.ret.gapClosing',
      values: {
        additionalMonthly: fmt(result.requiredAdditionalMonthly),
      },
    });
  }

  // 4. FIRE Number insight
  if (result.fireNumber !== null && result.fireProgress !== null) {
    items.push({
      key: 'interpretation.ret.fireNumber',
      values: {
        fireNumber: fmt(result.fireNumber),
        withdrawalRate: inputs.withdrawalRate,
        progress: Math.round(result.fireProgress),
      },
    });
  }

  // 5. Monthly retirement income
  if (result.monthlyRetirementIncome > 0) {
    items.push({
      key: 'interpretation.ret.monthlyIncome',
      values: {
        monthlyIncome: fmt(result.monthlyRetirementIncome),
        withdrawalRate: inputs.withdrawalRate,
      },
    });
  }

  return items;
}

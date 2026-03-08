import type {
  RetirementInputs,
  RetirementResult,
  InterpretationItem,
} from '../calculations/types.ts';
import { formatCurrency } from '../formatters.ts';

/**
 * Generate interpretation items (translation keys + values) for retirement calculation results.
 */
export function generateRetirementInterpretations(
  inputs: RetirementInputs,
  result: RetirementResult,
): InterpretationItem[] {
  const items: InterpretationItem[] = [];

  // 1. Main summary
  items.push({
    key: 'interpretation.ret.mainSummary',
    values: {
      retirementAge: inputs.retirementAge,
      balance: formatCurrency(result.estimatedBalance),
    },
  });

  // 2. Readiness assessment
  switch (result.readiness) {
    case 'on_track': {
      items.push({
        key: 'interpretation.ret.onTrack',
        values: {
          goal: formatCurrency(inputs.desiredFund!),
        },
      });
      break;
    }
    case 'close': {
      items.push({
        key: 'interpretation.ret.close',
        values: {
          goal: formatCurrency(inputs.desiredFund!),
          gap: formatCurrency(Math.abs(result.gap!)),
        },
      });
      break;
    }
    case 'behind': {
      items.push({
        key: 'interpretation.ret.behind',
        values: {
          goal: formatCurrency(inputs.desiredFund!),
          gap: formatCurrency(Math.abs(result.gap!)),
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
        additionalMonthly: formatCurrency(result.requiredAdditionalMonthly),
      },
    });
  }

  return items;
}

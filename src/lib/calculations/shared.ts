import type { CompoundFrequency } from './types.ts';

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function compoundFrequencyToN(freq: CompoundFrequency): number {
  switch (freq) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'annually':
      return 1;
  }
}

export function ruleOf72(annualReturn: number): number {
  if (annualReturn <= 0) return Infinity;
  return 72 / annualReturn;
}

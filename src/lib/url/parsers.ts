import { parseAsFloat, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { CALCULATOR_LIMITS } from '../constants.ts';
import type { CompoundFrequency } from '../calculations/types.ts';

const ciDefaults = CALCULATOR_LIMITS.compoundInterest;
const igDefaults = CALCULATOR_LIMITS.investmentGrowth;
const retDefaults = CALCULATOR_LIMITS.retirement;

// ─── Compound Interest ──────────────────────────────────

export const compoundInterestParsers = {
  init: parseAsFloat.withDefault(ciDefaults.initialAmount.default),
  monthly: parseAsFloat.withDefault(ciDefaults.monthlyContribution.default),
  years: parseAsInteger.withDefault(ciDefaults.years.default),
  return: parseAsFloat.withDefault(ciDefaults.annualReturn.default),
  freq: parseAsStringEnum<CompoundFrequency>([
    'monthly',
    'quarterly',
    'annually',
  ]).withDefault(ciDefaults.compoundFrequency.default),
};

// ─── Investment Growth ──────────────────────────────────

export const investmentGrowthParsers = {
  ...compoundInterestParsers,
  init: parseAsFloat.withDefault(igDefaults.initialAmount.default),
  monthly: parseAsFloat.withDefault(igDefaults.monthlyContribution.default),
  years: parseAsInteger.withDefault(igDefaults.years.default),
  return: parseAsFloat.withDefault(igDefaults.annualReturn.default),
  freq: parseAsStringEnum<CompoundFrequency>([
    'monthly',
    'quarterly',
    'annually',
  ]).withDefault(igDefaults.compoundFrequency.default),
  target: parseAsFloat,
  fees: parseAsFloat.withDefault(igDefaults.expenseRatio.default),
};

// ─── Retirement ─────────────────────────────────────────

export const retirementParsers = {
  age: parseAsInteger.withDefault(retDefaults.currentAge.default),
  retire: parseAsInteger.withDefault(retDefaults.retirementAge.default),
  savings: parseAsFloat.withDefault(retDefaults.currentSavings.default),
  monthly: parseAsFloat.withDefault(retDefaults.monthlyContribution.default),
  return: parseAsFloat.withDefault(retDefaults.annualReturn.default),
  goal: parseAsFloat,
  expenses: parseAsFloat,
  wr: parseAsFloat.withDefault(retDefaults.withdrawalRate.default),
};

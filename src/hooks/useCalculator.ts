'use client';

import { useMemo } from 'react';
import { useQueryStates } from 'nuqs';

import {
  compoundInterestParsers,
  investmentGrowthParsers,
  retirementParsers,
} from '../lib/url/parsers.ts';
import { calculateCompoundInterest } from '../lib/calculations/compound-interest.ts';
import { calculateInvestmentGrowth } from '../lib/calculations/investment-growth.ts';
import { calculateRetirement } from '../lib/calculations/retirement.ts';
import { generateCompoundInterestInterpretations } from '../lib/interpretations/compound-interest.ts';
import { generateInvestmentGrowthInterpretations } from '../lib/interpretations/investment-growth.ts';
import { generateRetirementInterpretations } from '../lib/interpretations/retirement.ts';

import type {
  CompoundInterestInputs,
  CompoundInterestResult,
  InvestmentGrowthInputs,
  InvestmentGrowthResult,
  RetirementInputs,
  RetirementResult,
  InterpretationItem,
} from '../lib/calculations/types.ts';

const NUQS_OPTIONS = {
  history: 'replace' as const,
  shallow: true,
  throttleMs: 150,
};

// ─── Compound Interest ──────────────────────────────────

export function useCompoundInterestCalculator() {
  const [params, setParams] = useQueryStates(
    compoundInterestParsers,
    NUQS_OPTIONS,
  );

  const inputs: CompoundInterestInputs = useMemo(
    () => ({
      initialAmount: params.init,
      monthlyContribution: params.monthly,
      years: params.years,
      annualReturn: params.return,
      compoundFrequency: params.freq,
    }),
    [params.init, params.monthly, params.years, params.return, params.freq],
  );

  const result: CompoundInterestResult = useMemo(
    () => calculateCompoundInterest(inputs),
    [inputs],
  );

  const interpretations: InterpretationItem[] = useMemo(
    () => generateCompoundInterestInterpretations(inputs, result),
    [inputs, result],
  );

  return { inputs, setInputs: setParams, result, interpretations } as const;
}

// ─── Investment Growth ──────────────────────────────────

export function useInvestmentGrowthCalculator() {
  const [params, setParams] = useQueryStates(
    investmentGrowthParsers,
    NUQS_OPTIONS,
  );

  const inputs: InvestmentGrowthInputs = useMemo(
    () => ({
      initialAmount: params.init,
      monthlyContribution: params.monthly,
      years: params.years,
      annualReturn: params.return,
      compoundFrequency: params.freq,
      targetAmount: params.target,
    }),
    [
      params.init,
      params.monthly,
      params.years,
      params.return,
      params.freq,
      params.target,
    ],
  );

  const result: InvestmentGrowthResult = useMemo(
    () => calculateInvestmentGrowth(inputs),
    [inputs],
  );

  const interpretations: InterpretationItem[] = useMemo(
    () => generateInvestmentGrowthInterpretations(inputs, result),
    [inputs, result],
  );

  return { inputs, setInputs: setParams, result, interpretations } as const;
}

// ─── Retirement ─────────────────────────────────────────

export function useRetirementCalculator() {
  const [params, setParams] = useQueryStates(
    retirementParsers,
    NUQS_OPTIONS,
  );

  const inputs: RetirementInputs = useMemo(
    () => ({
      currentAge: params.age,
      retirementAge: params.retire,
      currentSavings: params.savings,
      monthlyContribution: params.monthly,
      annualReturn: params.return,
      desiredFund: params.goal,
    }),
    [
      params.age,
      params.retire,
      params.savings,
      params.monthly,
      params.return,
      params.goal,
    ],
  );

  const result: RetirementResult = useMemo(
    () => calculateRetirement(inputs),
    [inputs],
  );

  const interpretations: InterpretationItem[] = useMemo(
    () => generateRetirementInterpretations(inputs, result),
    [inputs, result],
  );

  return { inputs, setInputs: setParams, result, interpretations } as const;
}

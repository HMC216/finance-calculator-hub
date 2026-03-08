export const SITE_CONFIG = {
  name: 'Finance Calculator Hub',
  url: 'https://financecalculatorhub.com',
  description:
    'Free online financial calculators for compound interest, investment growth, retirement planning, and more.',
  author: {
    name: 'Finance Calculator Hub',
    credential: 'CFA',
  },
  email: 'contact@financecalculatorhub.com',
} as const;

/* ─── Field Limits & Defaults ─────────────────────────── */

interface FieldLimit {
  min: number;
  max: number;
  step: number;
  default: number;
}

interface SelectLimit<T extends string> {
  options: readonly T[];
  default: T;
}

export const CALCULATOR_LIMITS = {
  compoundInterest: {
    initialAmount: { min: 0, max: 1_000_000, step: 1000, default: 10_000 } satisfies FieldLimit,
    monthlyContribution: { min: 0, max: 10_000, step: 100, default: 500 } satisfies FieldLimit,
    years: { min: 1, max: 50, step: 1, default: 10 } satisfies FieldLimit,
    annualReturn: { min: 0, max: 30, step: 0.1, default: 7 } satisfies FieldLimit,
    compoundFrequency: {
      options: ['monthly', 'quarterly', 'annually'] as const,
      default: 'monthly' as const,
    },
  },
  investmentGrowth: {
    initialAmount: { min: 0, max: 1_000_000, step: 1000, default: 10_000 } satisfies FieldLimit,
    monthlyContribution: { min: 0, max: 10_000, step: 100, default: 500 } satisfies FieldLimit,
    years: { min: 1, max: 50, step: 1, default: 10 } satisfies FieldLimit,
    annualReturn: { min: 0, max: 30, step: 0.1, default: 7 } satisfies FieldLimit,
    compoundFrequency: {
      options: ['monthly', 'quarterly', 'annually'] as const,
      default: 'monthly' as const,
    },
    targetAmount: { min: 0, max: 10_000_000, step: 10_000, default: 0 } satisfies FieldLimit,
  },
  retirement: {
    currentAge: { min: 18, max: 80, step: 1, default: 30 } satisfies FieldLimit,
    retirementAge: { min: 30, max: 90, step: 1, default: 65 } satisfies FieldLimit,
    currentSavings: { min: 0, max: 5_000_000, step: 1000, default: 50_000 } satisfies FieldLimit,
    monthlyContribution: { min: 0, max: 20_000, step: 100, default: 1000 } satisfies FieldLimit,
    annualReturn: { min: 0, max: 30, step: 0.1, default: 7 } satisfies FieldLimit,
    desiredFund: { min: 0, max: 10_000_000, step: 10_000, default: 0 } satisfies FieldLimit,
  },
} as const;

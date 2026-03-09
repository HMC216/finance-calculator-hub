export type CompoundFrequency = 'monthly' | 'quarterly' | 'annually';
export type CalculatorType = 'compound-interest' | 'investment-growth' | 'retirement';

// ─── Inputs ──────────────────────────────────────────────

export interface CompoundInterestInputs {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  compoundFrequency: CompoundFrequency;
}

export interface InvestmentGrowthInputs extends CompoundInterestInputs {
  targetAmount: number | null;
  expenseRatio: number;
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  desiredFund: number | null;
  annualExpenses: number | null;
  withdrawalRate: number;
}

// ─── Outputs ─────────────────────────────────────────────

export interface YearlyDataPoint {
  year: number;
  contributions: number;
  interestEarned: number;
  totalBalance: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  interestPercentage: number;
  yearlyData: YearlyDataPoint[];
}

export interface ScenarioResult {
  label: 'Conservative' | 'Base' | 'Aggressive';
  returnRate: number;
  result: CompoundInterestResult;
  yearsToTarget: number | null;
}

export interface FeeImpactResult {
  balanceWithFees: number;
  balanceWithoutFees: number;
  totalFeesLost: number;
}

export interface InvestmentGrowthResult {
  scenarios: [ScenarioResult, ScenarioResult, ScenarioResult];
  requiredMonthly: number | null;
  feeImpact: FeeImpactResult | null;
}

export interface RetirementResult {
  estimatedBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyData: YearlyDataPoint[];
  gap: number | null;
  requiredAdditionalMonthly: number | null;
  readiness: 'on_track' | 'close' | 'behind' | 'no_target';
  fireNumber: number | null;
  monthlyRetirementIncome: number;
  fireProgress: number | null;
}

// ─── Interpretation ──────────────────────────────────────

export interface InterpretationSentence {
  text: string;
  highlights: Record<string, string>;
}

export interface InterpretationItem {
  key: string;
  values: Record<string, string | number>;
}

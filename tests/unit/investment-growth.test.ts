import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvestmentGrowth } from '../../src/lib/calculations/investment-growth.ts';

describe('calculateInvestmentGrowth', () => {
  it('generates 3 scenarios with correct labels', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 20,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: null,
    });
    assert.strictEqual(result.scenarios.length, 3);
    assert.strictEqual(result.scenarios[0].label, 'Conservative');
    assert.strictEqual(result.scenarios[1].label, 'Base');
    assert.strictEqual(result.scenarios[2].label, 'Aggressive');
  });

  it('conservative < base < aggressive', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 20,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: null,
    });
    assert.ok(result.scenarios[0].result.finalBalance < result.scenarios[1].result.finalBalance);
    assert.ok(result.scenarios[1].result.finalBalance < result.scenarios[2].result.finalBalance);
  });

  it('scenario rates offset by ±3%', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 20,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: null,
    });
    assert.strictEqual(result.scenarios[0].returnRate, 5);
    assert.strictEqual(result.scenarios[1].returnRate, 8);
    assert.strictEqual(result.scenarios[2].returnRate, 11);
  });

  it('conservative rate clamped to 0 when base < 3%', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 10,
      annualReturn: 2, compoundFrequency: 'monthly', targetAmount: null,
    });
    assert.strictEqual(result.scenarios[0].returnRate, 0);
  });

  it('yearsToTarget when target is reachable', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 30,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: 100_000,
    });
    assert.ok(result.scenarios[1].yearsToTarget !== null);
    assert.ok(result.scenarios[1].yearsToTarget! > 0);
  });

  it('requiredMonthly when base falls short', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 0, monthlyContribution: 100, years: 5,
      annualReturn: 5, compoundFrequency: 'monthly', targetAmount: 1_000_000,
    });
    assert.ok(result.requiredMonthly !== null);
    assert.ok(result.requiredMonthly! > 0);
  });

  it('no requiredMonthly when target achieved', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 100_000, monthlyContribution: 5_000, years: 30,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: 100_000,
    });
    assert.strictEqual(result.requiredMonthly, null);
  });

  it('no yearsToTarget when target is null', () => {
    const result = calculateInvestmentGrowth({
      initialAmount: 10_000, monthlyContribution: 500, years: 20,
      annualReturn: 8, compoundFrequency: 'monthly', targetAmount: null,
    });
    for (const s of result.scenarios) {
      assert.strictEqual(s.yearsToTarget, null);
    }
  });
});

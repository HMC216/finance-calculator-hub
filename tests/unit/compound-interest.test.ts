import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCompoundInterest } from '../../src/lib/calculations/compound-interest.ts';

describe('calculateCompoundInterest', () => {
  it('basic compound: $10K, no monthly, 10yr, 10%, annually → $25,937', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000,
      monthlyContribution: 0,
      years: 10,
      annualReturn: 10,
      compoundFrequency: 'annually',
    });
    assert.ok(Math.abs(result.finalBalance - 25_937.42) < 10);
  });

  it('monthly contributions: $0 init, $500/mo, 30yr, 8%, monthly → ~$745K', () => {
    const result = calculateCompoundInterest({
      initialAmount: 0,
      monthlyContribution: 500,
      years: 30,
      annualReturn: 8,
      compoundFrequency: 'monthly',
    });
    assert.ok(Math.abs(result.finalBalance - 745_180) < 500);
  });

  it('0% return: $10K + $100/mo, 10yr → $22,000', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000,
      monthlyContribution: 100,
      years: 10,
      annualReturn: 0,
      compoundFrequency: 'monthly',
    });
    assert.ok(Math.abs(result.finalBalance - 22_000) < 1);
    assert.strictEqual(result.totalInterest, 0);
  });

  it('max values do not overflow', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000_000,
      monthlyContribution: 100_000,
      years: 50,
      annualReturn: 25,
      compoundFrequency: 'monthly',
    });
    assert.ok(Number.isFinite(result.finalBalance));
    assert.ok(result.finalBalance > 0);
  });

  it('yearly data has correct length', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000,
      monthlyContribution: 500,
      years: 20,
      annualReturn: 8,
      compoundFrequency: 'monthly',
    });
    assert.strictEqual(result.yearlyData.length, 20);
    assert.ok(Math.abs(result.yearlyData[19].totalBalance - result.finalBalance) < 1);
  });

  it('interest percentage is valid', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000,
      monthlyContribution: 500,
      years: 20,
      annualReturn: 8,
      compoundFrequency: 'monthly',
    });
    assert.ok(result.interestPercentage > 0);
    assert.ok(result.interestPercentage < 100);
  });

  it('quarterly > annual compounding', () => {
    const result = calculateCompoundInterest({
      initialAmount: 10_000,
      monthlyContribution: 0,
      years: 10,
      annualReturn: 10,
      compoundFrequency: 'quarterly',
    });
    assert.ok(result.finalBalance > 25_937);
  });

  it('contributions accumulate correctly at 0%', () => {
    const result = calculateCompoundInterest({
      initialAmount: 1_000,
      monthlyContribution: 100,
      years: 5,
      annualReturn: 0,
      compoundFrequency: 'monthly',
    });
    assert.ok(Math.abs(result.totalContributions - 7_000) < 1);
  });
});

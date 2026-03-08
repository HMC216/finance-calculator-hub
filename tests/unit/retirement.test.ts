import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRetirement } from '../../src/lib/calculations/retirement.ts';

describe('calculateRetirement', () => {
  it('0% return: age 40→65, $0 savings, $1K/mo → $300,000', () => {
    const result = calculateRetirement({
      currentAge: 40, retirementAge: 65, currentSavings: 0,
      monthlyContribution: 1_000, annualReturn: 0, desiredFund: null,
    });
    assert.ok(Math.abs(result.estimatedBalance - 300_000) < 1);
    assert.strictEqual(result.readiness, 'no_target');
  });

  it('readiness: on_track when surplus exists', () => {
    const result = calculateRetirement({
      currentAge: 25, retirementAge: 65, currentSavings: 50_000,
      monthlyContribution: 2_000, annualReturn: 8, desiredFund: 500_000,
    });
    assert.strictEqual(result.readiness, 'on_track');
    assert.ok(result.gap! < 0);
  });

  it('readiness: behind when large gap', () => {
    const result = calculateRetirement({
      currentAge: 55, retirementAge: 65, currentSavings: 10_000,
      monthlyContribution: 200, annualReturn: 5, desiredFund: 2_000_000,
    });
    assert.strictEqual(result.readiness, 'behind');
    assert.ok(result.requiredAdditionalMonthly! > 0);
    assert.ok(result.gap! > 0);
  });

  it('yearly data uses age as year', () => {
    const result = calculateRetirement({
      currentAge: 30, retirementAge: 35, currentSavings: 10_000,
      monthlyContribution: 500, annualReturn: 5, desiredFund: null,
    });
    assert.strictEqual(result.yearlyData.length, 5);
    assert.strictEqual(result.yearlyData[0].year, 31);
    assert.strictEqual(result.yearlyData[4].year, 35);
  });

  it('totalInterest = estimatedBalance - totalContributions', () => {
    const result = calculateRetirement({
      currentAge: 30, retirementAge: 65, currentSavings: 100_000,
      monthlyContribution: 1_000, annualReturn: 7, desiredFund: null,
    });
    assert.ok(Math.abs(result.totalInterest - (result.estimatedBalance - result.totalContributions)) < 1);
  });
});

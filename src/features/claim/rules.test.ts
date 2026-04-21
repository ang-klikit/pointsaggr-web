import { describe, expect, it } from 'vitest';
import { POINTS_RULES, computePoints } from './rules';

describe('computePoints', () => {
  it('awards 1 point per currency unit', () => {
    expect(computePoints(1500)).toBe(15);
    expect(computePoints(9999)).toBe(99);
  });

  it('floors fractional units (cents under 100 do not count)', () => {
    expect(computePoints(1599)).toBe(15);
    expect(computePoints(50)).toBe(POINTS_RULES.minPointsPerClaim);
  });

  it('never returns less than the configured minimum for non-zero amounts', () => {
    expect(computePoints(1)).toBe(POINTS_RULES.minPointsPerClaim);
  });

  it('returns 0 for invalid inputs', () => {
    expect(computePoints(-100)).toBe(0);
    expect(computePoints(Number.NaN)).toBe(0);
    expect(computePoints(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('clamps to the configured maximum', () => {
    const huge = (POINTS_RULES.maxPointsPerClaim + 1) * 100;
    expect(computePoints(huge)).toBe(POINTS_RULES.maxPointsPerClaim);
  });
});

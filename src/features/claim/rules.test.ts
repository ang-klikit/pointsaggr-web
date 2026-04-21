import { describe, expect, it } from 'vitest';
import { POINTS_RULES, computePoints } from './rules';

describe('computePoints', () => {
  it('awards 1 point per Rp 1,000 spent (IDR scale)', () => {
    // Rp 1,000 → 1 pt
    expect(computePoints(100_000)).toBe(1);
    // Rp 100,000 → 100 pts (~1 raffle entry)
    expect(computePoints(10_000_000)).toBe(100);
    // Rp 999,000 → 999 pts
    expect(computePoints(99_900_000)).toBe(999);
  });

  it('floors spend under the point threshold to the minimum', () => {
    // Rp 500 → rounds down to 0 raw, then clamped to the floor
    expect(computePoints(50_000)).toBe(POINTS_RULES.minPointsPerClaim);
    // Rp 1,599 → 1 pt (fractional remainder drops)
    expect(computePoints(159_900)).toBe(1);
    // Rp 1,999 → still 1 pt
    expect(computePoints(199_900)).toBe(1);
  });

  it('never returns less than the configured minimum for non-zero amounts', () => {
    expect(computePoints(1)).toBe(POINTS_RULES.minPointsPerClaim);
  });

  it('returns 0 for zero / invalid inputs', () => {
    expect(computePoints(0)).toBe(0);
    expect(computePoints(-100)).toBe(0);
    expect(computePoints(Number.NaN)).toBe(0);
    expect(computePoints(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('clamps to the configured maximum', () => {
    // Spend required to exceed the cap by 1 pt, in cents.
    const huge =
      (POINTS_RULES.maxPointsPerClaim + 1) *
      POINTS_RULES.currencyPerPoint *
      100;
    expect(computePoints(huge)).toBe(POINTS_RULES.maxPointsPerClaim);
  });
});

/**
 * Points calculation rules.
 *
 * Kept intentionally small + pure so the backend can replace the math later
 * without touching any UI. `computePoints` is the only public surface.
 */

export const POINTS_RULES = {
  /** Points awarded per 1 unit of currency (e.g. MYR 15 -> 15 pts). */
  ratePerCurrencyUnit: 1,
  /** Floor so every claim feels rewarding, even tiny purchases. */
  minPointsPerClaim: 1,
  /** Ceiling to prevent a single absurd scan from dominating the cache. */
  maxPointsPerClaim: 10_000,
} as const;

/**
 * Compute the points awarded for a given transaction amount (in cents).
 *
 * @param amountCents - order total in minor units (e.g. 1500 = RM 15.00)
 * @returns integer point value, clamped to the [min, max] configured rule
 */
export function computePoints(amountCents: number): number {
  if (!Number.isFinite(amountCents) || amountCents < 0) return 0;
  const units = Math.floor(amountCents / 100);
  const raw = units * POINTS_RULES.ratePerCurrencyUnit;
  const clamped = Math.max(
    POINTS_RULES.minPointsPerClaim,
    Math.min(POINTS_RULES.maxPointsPerClaim, raw),
  );
  return clamped;
}

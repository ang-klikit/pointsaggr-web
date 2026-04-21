/**
 * Points calculation rules.
 *
 * Kept intentionally small + pure so the backend can replace the math later
 * without touching any UI. `computePoints` is the only public surface.
 *
 * Deployment target is IDR (Indonesian Rupiah) — the QR payload carries
 * `amountCents` that is always `rawPrice * 100` on the klikstart side
 * regardless of currency, so the math below works in hundredths of a
 * whole currency unit.
 */

export const POINTS_RULES = {
  /**
   * Whole currency units required to earn 1 point.
   *
   * For IDR: `1_000` → every Rp 1,000 of spend earns 1 point, so a typical
   * Rp 100,000 restaurant bill maps to 100 pts (= 1 raffle entry at the
   * current 100-pts-per-entry rate). Tune this single number to rebalance
   * the program without touching the callers.
   */
  currencyPerPoint: 1_000,
  /** Floor so every non-zero claim feels rewarding, even tiny purchases. */
  minPointsPerClaim: 1,
  /** Ceiling to prevent a single absurd scan from dominating the cache. */
  maxPointsPerClaim: 10_000,
} as const;

/**
 * Compute the points awarded for a given transaction amount (in cents).
 *
 * @param amountCents - order total in minor units (e.g. 100_000 = Rp 1,000)
 * @returns integer point value, clamped to the [min, max] configured rule
 */
export function computePoints(amountCents: number): number {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return 0;
  const units = Math.floor(amountCents / 100);
  const raw = Math.floor(units / POINTS_RULES.currencyPerPoint);
  const clamped = Math.max(
    POINTS_RULES.minPointsPerClaim,
    Math.min(POINTS_RULES.maxPointsPerClaim, raw),
  );
  return clamped;
}

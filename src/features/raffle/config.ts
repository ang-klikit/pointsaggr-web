/**
 * Raffle configuration.
 *
 * Static for v0 — computed on module load so the countdown always targets
 * the *next* draw date relative to when the tab booted. Replace with a
 * server-provided config when the backend lands.
 *
 * Rules of thumb when tweaking:
 *   - Weekly draws should always be in the near future (≤ 7 days out) so
 *     the countdown stays emotionally present.
 *   - The grand-prize window should be long enough that users return
 *     multiple times to watch it tick down.
 */

export type PrizeConfig = {
  /** Emoji shown when no hero image is available. */
  emoji: string;
  /**
   * Optional hero image (public asset path). When set the card shows the
   * image instead of the emoji square — use for real prize product shots.
   */
  image?: string;
  /** i18n key that resolves to the prize headline (e.g. "Wuling Air EV"). */
  titleKey: string;
  /** i18n key for the supporting line shown under the title. */
  subtitleKey: string;
  /** When this raffle round closes and a winner is drawn. */
  drawAt: Date;
};

/** The next Sunday at 20:00 local time; if today *is* Sunday, the one after. */
function nextSundayAt20(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntil = day === 0 ? 7 : 7 - day;
  const d = new Date(now);
  d.setDate(now.getDate() + daysUntil);
  d.setHours(20, 0, 0, 0);
  return d;
}

/** Last day of the current calendar quarter at 23:59:59 local. */
function endOfCurrentQuarter(): Date {
  const now = new Date();
  const quarterIndex = Math.floor(now.getMonth() / 3);
  const endMonth = quarterIndex * 3 + 2;
  return new Date(now.getFullYear(), endMonth + 1, 0, 23, 59, 59);
}

export const grandPrize: PrizeConfig = {
  emoji: '🚗',
  image: '/car.png',
  titleKey: 'raffle.grand_prize_title',
  subtitleKey: 'raffle.grand_prize_subtitle',
  drawAt: endOfCurrentQuarter(),
};

export const weeklyPrize: PrizeConfig = {
  emoji: '🎁',
  titleKey: 'raffle.weekly_prize_title',
  subtitleKey: 'raffle.weekly_prize_subtitle',
  drawAt: nextSundayAt20(),
};

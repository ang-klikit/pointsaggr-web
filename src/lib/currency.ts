const DEFAULT_LOCALE = 'id-ID';

/**
 * Format a cents-denominated amount for display.
 *
 * Falls back to a plain `{code} {fixed}` string when Intl doesn't recognize
 * the currency code (e.g. test fixtures), so the UI never 500s on unknowns.
 */
export function formatAmount(amountCents: number, currency: string, locale = DEFAULT_LOCALE): string {
  const value = amountCents / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatPoints(points: number, locale = DEFAULT_LOCALE): string {
  try {
    return new Intl.NumberFormat(locale).format(points);
  } catch {
    return String(points);
  }
}

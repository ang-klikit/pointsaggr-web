import { useTranslation } from 'react-i18next';
import { weeklyPrize } from '@/features/raffle/config';
import { useRaffleEntries } from '@/features/raffle/hooks';
import { CountdownTiles } from './CountdownTiles';

/**
 * Lighter companion to the grand-prize card. Weekly pulse: emoji, prize
 * line, compact countdown (no seconds), and this-week entries.
 */
export function WeeklyPrizeCard() {
  const { t } = useTranslation();
  const { thisWeek } = useRaffleEntries();
  const { emoji, titleKey, subtitleKey, drawAt } = weeklyPrize;

  return (
    <article
      className="
        relative overflow-hidden rounded-3xl bg-brand-50
        ring-1 ring-brand-100
        px-5 pt-5 pb-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
            {t('raffle.weekly_kicker')}
          </p>
          <h3 className="mt-2 text-xl font-bold leading-tight text-ink">{t(titleKey)}</h3>
          <p className="mt-1 max-w-[22ch] text-sm text-ink-muted">{t(subtitleKey)}</p>
        </div>
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-card"
          aria-hidden
        >
          {emoji}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-brand-700">{t('raffle.draws_in')}</p>
        <CountdownTiles target={drawAt} tone="light" compact />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-white">
        <span className="text-xs font-medium text-ink-muted">{t('raffle.your_entries_week')}</span>
        <span className="text-base font-semibold text-ink">
          {t('raffle.entries', { count: thisWeek })}
        </span>
      </div>
    </article>
  );
}

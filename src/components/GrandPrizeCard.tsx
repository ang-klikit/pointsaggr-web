import { useTranslation } from 'react-i18next';
import { grandPrize } from '@/features/raffle/config';
import { useRaffleEntries } from '@/features/raffle/hooks';
import { CountdownTiles } from './CountdownTiles';

/**
 * Premium dark hero for the grand prize — prize photo (or fallback emoji),
 * headline, draw countdown, and the user's running entry count.
 */
export function GrandPrizeCard() {
  const { t } = useTranslation();
  const { total } = useRaffleEntries();
  const { emoji, image, titleKey, subtitleKey, drawAt } = grandPrize;

  return (
    <article
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-ink via-brand-900 to-ink
        text-white shadow-card
        px-6 pt-6 pb-6
      "
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
            {t('raffle.grand_kicker')}
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-tight">{t(titleKey)}</h3>
          <p className="mt-1 max-w-[20ch] text-sm text-white/70">{t(subtitleKey)}</p>
        </div>
        {image ? (
          <div
            className="
              flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden
              rounded-2xl bg-white p-1.5 shadow-lg shadow-black/40 ring-1 ring-white/20
            "
            aria-hidden
          >
            <img src={image} alt="" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-5xl ring-1 ring-white/10"
            aria-hidden
          >
            {emoji}
          </div>
        )}
      </div>

      <div className="relative mt-5">
        <p className="mb-2 text-xs font-medium text-white/70">{t('raffle.draws_in')}</p>
        <CountdownTiles target={drawAt} tone="dark" />
      </div>

      <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
        <span className="text-xs font-medium text-white/70">{t('raffle.your_entries')}</span>
        <span className="text-base font-semibold">
          {t('raffle.entries', { count: total })}
        </span>
      </div>
    </article>
  );
}

import { useTranslation } from 'react-i18next';
import { useCountdown } from '@/features/raffle/hooks';

type Tone = 'dark' | 'light';

type Props = {
  target: Date;
  tone?: Tone;
  /** Hide the seconds tile on tighter layouts (weekly card). */
  compact?: boolean;
};

/**
 * Four tiles: days / hours / minutes / seconds. Two visual tones so the
 * block can sit on both the dark grand-prize card and the lighter weekly
 * card without feeling out of place.
 */
export function CountdownTiles({ target, tone = 'dark', compact = false }: Props) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(target);
  const { t } = useTranslation();

  if (isPast) {
    return (
      <p className={['text-sm font-medium', tone === 'dark' ? 'text-white/80' : 'text-ink-muted'].join(' ')}>
        {t('raffle.draw_complete')}
      </p>
    );
  }

  const tiles: Array<[number, string]> = [
    [days, t('raffle.countdown_days')],
    [hours, t('raffle.countdown_hours')],
    [minutes, t('raffle.countdown_minutes')],
  ];
  if (!compact) tiles.push([seconds, t('raffle.countdown_seconds')]);

  const tileClass =
    tone === 'dark'
      ? 'bg-white/10 text-white ring-1 ring-white/10 backdrop-blur-sm'
      : 'bg-canvas text-ink ring-1 ring-ink/5 shadow-card';
  const labelClass = tone === 'dark' ? 'text-white/70' : 'text-ink-muted';

  return (
    <div className={['grid gap-2', compact ? 'grid-cols-3' : 'grid-cols-4'].join(' ')}>
      {tiles.map(([n, label]) => (
        <div key={label} className={['rounded-xl px-2 py-2.5 text-center', tileClass].join(' ')}>
          <div className="text-2xl font-bold tabular-nums leading-none">
            {String(n).padStart(2, '0')}
          </div>
          <div
            className={['mt-1.5 text-[10px] font-semibold uppercase tracking-wider', labelClass].join(' ')}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

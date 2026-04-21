import { useTranslation } from 'react-i18next';
import { usePointsStore } from '@/store/points';
import { formatAmount, formatPoints } from '@/lib/currency';

export function History() {
  const { t, i18n } = useTranslation();
  const claims = usePointsStore((s) => s.claims);
  const dateFmt = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 safe-top">
      <header>
        <h1 className="text-xl font-semibold">{t('history.title')}</h1>
      </header>

      {claims.length === 0 ? (
        <p className="rounded-2xl bg-canvas-soft p-6 text-center text-sm text-ink-muted">
          {t('history.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {claims.map((c) => (
            <li
              key={c.orderHash}
              className="
                flex items-center justify-between gap-4 rounded-2xl border border-ink/5
                bg-canvas p-4 shadow-card
              "
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {c.brand ?? `#${c.orderId}`}
                </p>
                <p className="text-xs text-ink-muted">
                  {formatAmount(c.amountCents, c.currency)} ·{' '}
                  {t('history.earned_on', { date: dateFmt.format(new Date(c.claimedAt)) })}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                +{formatPoints(c.points)} {t('history.points_suffix')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

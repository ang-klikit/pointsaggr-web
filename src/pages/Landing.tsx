import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePointsStore } from '@/store/points';
import { useAccountStore } from '@/store/account';
import { BrandHeader } from '@/components/BrandHeader';
import { HeroBalance } from '@/components/HeroBalance';
import { RegisterCta } from '@/components/RegisterCta';
import { GrandPrizeCard } from '@/components/GrandPrizeCard';
import { WeeklyPrizeCard } from '@/components/WeeklyPrizeCard';
import { ScanCta } from '@/components/ScanCta';
import { formatAmount, formatPoints } from '@/lib/currency';

export function Landing() {
  const { t, i18n } = useTranslation();
  const total = usePointsStore((s) => s.totalPoints);
  const claims = usePointsStore((s) => s.claims);
  const account = useAccountStore((s) => s.account);
  const recent = claims.slice(0, 3);

  const dateFmt = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' });

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-6 safe-top">
      <BrandHeader variant="hero" />

      {account ? <HeroBalance total={total} /> : <RegisterCta />}

      <ScanCta />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
          {t('raffle.section_title')}
        </h2>
        <GrandPrizeCard />
        <WeeklyPrizeCard />
      </section>

      {!account || recent.length === 0 ? null : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
              {t('nav.history')}
            </h2>
            <Link
              to="/me/history"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {t('landing.cta_history')}
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((c) => (
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
                    {dateFmt.format(new Date(c.claimedAt))}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                  +{formatPoints(c.points)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

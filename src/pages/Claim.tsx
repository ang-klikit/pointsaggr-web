import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { decodeClaimPayload, type ClaimPayload } from '@/features/claim/payload';
import { computePoints } from '@/features/claim/rules';
import { usePointsStore, type ClaimRecord } from '@/store/points';
import { useAccountStore } from '@/store/account';
import { Button } from '@/components/ui/Button';
import { BrandHeader } from '@/components/BrandHeader';
import { OrderSummaryCard } from '@/components/OrderSummaryCard';
import { PointsBadge } from '@/components/PointsBadge';
import { useToast } from '@/components/ui/Toast';

type ScreenState =
  | { kind: 'pending'; payload: ClaimPayload; pointsPreview: number }
  | { kind: 'success'; payload: ClaimPayload; points: number }
  | { kind: 'already'; record: ClaimRecord; payload: ClaimPayload }
  | { kind: 'error' };

export function Claim() {
  const { payload: raw } = useParams<{ payload: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const claimFn = usePointsStore((s) => s.claim);
  const findClaim = usePointsStore((s) => s.findClaim);
  const account = useAccountStore((s) => s.account);

  const initial = useMemo<ScreenState>(() => {
    if (!raw) return { kind: 'error' };
    try {
      const decoded = decodeClaimPayload(raw);
      const existing = findClaim(raw);
      if (existing) return { kind: 'already', record: existing, payload: decoded };
      return { kind: 'pending', payload: decoded, pointsPreview: computePoints(decoded.amountCents) };
    } catch {
      return { kind: 'error' };
    }
    // findClaim reads from a fresh snapshot on render; intentionally not reactive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const [screen, setScreen] = useState<ScreenState>(initial);

  useEffect(() => {
    setScreen(initial);
  }, [initial]);

  const handleClaim = () => {
    if (screen.kind !== 'pending' || !raw) return;
    if (!account) {
      const next = encodeURIComponent(`/c/${raw}`);
      navigate(`/me/register?next=${next}`);
      return;
    }
    const points = screen.pointsPreview;
    const record: ClaimRecord = {
      orderHash: raw,
      orderId: screen.payload.orderId,
      points,
      amountCents: screen.payload.amountCents,
      currency: screen.payload.currency,
      brand: screen.payload.brand,
      claimedAt: new Date().toISOString(),
    };
    const result = claimFn(record);
    if (result.ok) {
      setScreen({ kind: 'success', payload: screen.payload, points });
      showToast({
        kind: 'success',
        title: t('claim.success_title'),
        body: t('claim.success_body', { points }),
      });
    } else {
      setScreen({ kind: 'already', record: result.existing, payload: screen.payload });
    }
  };

  // When the user just completed registration we redirect back to `/c/:raw?autoclaim=1`.
  // Fire the claim automatically so they don't need to tap twice.
  useEffect(() => {
    if (search.get('autoclaim') !== '1') return;
    if (!account || screen.kind !== 'pending') return;
    handleClaim();
    const params = new URLSearchParams(search);
    params.delete('autoclaim');
    setSearch(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, screen.kind]);

  if (screen.kind === 'error') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center safe-top">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-danger/10 text-danger">
          <ExclamationIcon />
        </div>
        <h1 className="text-xl font-semibold">{t('claim.error_title')}</h1>
        <p className="max-w-xs text-sm text-ink-muted">{t('claim.error_body')}</p>
        <Button variant="secondary" onClick={() => navigate('/', { replace: true })}>
          {t('claim.error_back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-10 safe-top">
      <header className="flex flex-col gap-3">
        <BrandHeader />
        <h1 className="text-xl font-semibold">{t('claim.title')}</h1>
      </header>

      <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-7 text-white shadow-hero">
        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
          {t('claim.you_will_earn')}
        </p>
        <div className="mt-2">
          <PointsBadge points={pointsFor(screen)} size="lg" />
        </div>
      </div>

      <OrderSummaryCard
        orderId={screen.payload.orderId}
        amountCents={screen.payload.amountCents}
        currency={screen.payload.currency}
        brand={screen.payload.brand}
        createdAt={screen.payload.createdAt}
      />

      {screen.kind === 'already' ? (
        <section className="rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm">
          <p className="font-semibold text-warning">{t('claim.already_title')}</p>
          <p className="mt-1 text-ink-muted">
            {t('claim.already_body', {
              points: screen.record.points,
              date: new Intl.DateTimeFormat(i18n.language, {
                dateStyle: 'medium',
              }).format(new Date(screen.record.claimedAt)),
            })}
          </p>
        </section>
      ) : null}

      <div className="sticky bottom-4 z-10 mt-2">
        {screen.kind === 'pending' ? (
          <Button size="lg" fullWidth onClick={handleClaim}>
            {account
              ? t('claim.cta_claim', { points: screen.pointsPreview })
              : t('claim.cta_register_first', { points: screen.pointsPreview })}
          </Button>
        ) : (
          <Link
            to="/"
            className="
              flex h-14 w-full items-center justify-center rounded-2xl
              bg-canvas-muted px-6 text-base font-semibold text-ink hover:bg-ink/5
            "
          >
            {t('claim.cta_view_balance')}
          </Link>
        )}
      </div>
    </div>
  );
}

function pointsFor(s: ScreenState): number {
  switch (s.kind) {
    case 'pending':
      return s.pointsPreview;
    case 'success':
      return s.points;
    case 'already':
      return s.record.points;
    case 'error':
      return 0;
  }
}

function ExclamationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 7v6m0 3v.5M4.2 19h15.6a1.2 1.2 0 0 0 1.05-1.8l-7.8-13.4a1.2 1.2 0 0 0-2.1 0L3.15 17.2A1.2 1.2 0 0 0 4.2 19Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

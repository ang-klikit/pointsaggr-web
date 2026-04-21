import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePointsStore } from '@/store/points';
import { useAccountStore } from '@/store/account';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { formatPoints } from '@/lib/currency';

type LangOption = { code: 'en' | 'id'; label: string };
const LANGUAGES: LangOption[] = [
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'en', label: 'English' },
];

export function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const account = useAccountStore((s) => s.account);
  const resetAccount = useAccountStore((s) => s.reset);
  const total = usePointsStore((s) => s.totalPoints);
  const claims = usePointsStore((s) => s.claims);
  const resetPoints = usePointsStore((s) => s.reset);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!account) {
      const next = encodeURIComponent(location.pathname);
      navigate(`/me/register?next=${next}`, { replace: true });
    }
  }, [account, location.pathname, navigate]);

  if (!account) return null;

  const handleReset = () => {
    resetPoints();
    resetAccount();
    setConfirmOpen(false);
    showToast({ kind: 'info', title: t('profile.reset_done') });
    navigate('/', { replace: true });
  };

  const initials =
    account.fullName
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .filter(Boolean)
      .slice(0, 2)
      .join('') || '?';

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 safe-top">
      <header>
        <h1 className="text-xl font-semibold">{t('profile.title')}</h1>
      </header>

      <section className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-canvas p-5 shadow-card">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{account.fullName}</p>
          <p className="truncate text-sm text-ink-muted">{account.phone}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/me/register')}
          className="shrink-0 rounded-full bg-canvas-muted px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5"
        >
          {t('profile.edit')}
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label={t('profile.total_points')} value={formatPoints(total)} />
        <Stat label={t('profile.total_claims')} value={String(claims.length)} />
      </section>

      <section className="rounded-2xl border border-ink/5 bg-canvas p-5 shadow-card">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {t('profile.language')}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {LANGUAGES.map((l) => {
            const active = i18n.language.startsWith(l.code);
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => i18n.changeLanguage(l.code)}
                className={[
                  'flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm',
                  active
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                    : 'bg-canvas-muted text-ink hover:bg-ink/5',
                ].join(' ')}
              >
                <span className="font-medium">{l.label}</span>
                {active ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <Button variant="danger" onClick={() => setConfirmOpen(true)}>
        {t('profile.reset')}
      </Button>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('profile.reset_confirm_title')}
        body={t('profile.reset_confirm_body')}
      >
        <Button variant="danger" onClick={handleReset}>
          {t('profile.reset_confirm_cta')}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
          {t('profile.cancel')}
        </Button>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/5 bg-canvas p-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

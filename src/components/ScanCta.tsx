import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

/**
 * Motivational banner that nudges users to scan more receipts. Tapping
 * the secondary action opens a 3-step how-to dialog. No in-app scanner —
 * users scan via their phone's native camera on a physical Jakarta tax
 * receipt (restaurant, hotel, or parking).
 */
export function ScanCta() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700
          text-white shadow-hero
          px-5 py-5
        "
      >
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"
            aria-hidden
          >
            <ScanIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold">{t('scan_cta.title')}</h3>
            <p className="mt-1 text-sm text-white/85">{t('scan_cta.subtitle')}</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                mt-3 inline-flex h-9 items-center gap-1.5 rounded-full
                bg-white/15 px-4 text-sm font-semibold text-white
                ring-1 ring-white/25 transition hover:bg-white/25
              "
            >
              {t('scan_cta.how')}
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen} title={t('scan_cta.how_title')}>
        <ol className="flex flex-col gap-3">
          <Step
            n={1}
            title={t('scan_cta.step_1_title')}
            body={t('scan_cta.step_1_body')}
          />
          <Step
            n={2}
            title={t('scan_cta.step_2_title')}
            body={t('scan_cta.step_2_body')}
          />
          <Step
            n={3}
            title={t('scan_cta.step_3_title')}
            body={t('scan_cta.step_3_body')}
          />
        </ol>
        <Button variant="primary" onClick={() => setOpen(false)}>
          {t('scan_cta.got_it')}
        </Button>
      </Dialog>
    </>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span
        className="
          flex h-7 w-7 shrink-0 items-center justify-center rounded-full
          bg-brand-50 text-sm font-bold text-brand-700
        "
        aria-hidden
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{body}</p>
      </div>
    </li>
  );
}

function ScanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3m12-4v3a1 1 0 0 1-1 1h-3M4 12h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

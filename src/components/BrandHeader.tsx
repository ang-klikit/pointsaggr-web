import { useTranslation } from 'react-i18next';

type Variant = 'hero' | 'compact';

type Props = {
  variant?: Variant;
};

/**
 * DKI Jakarta brand lockup: shield + program name + issuing agency.
 *
 * - `hero` is used on the Landing page as the primary brand block.
 * - `compact` is used on high-trust pages (Claim, Register) as a small
 *   strip that reminds users this is an official Bapenda program before
 *   they act.
 */
export function BrandHeader({ variant = 'compact' }: Props) {
  const { t } = useTranslation();

  if (variant === 'hero') {
    return (
      <header className="flex items-center gap-3">
        <img
          src="/dki.png"
          alt=""
          aria-hidden
          className="h-12 w-auto shrink-0 drop-shadow-sm"
        />
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight text-ink">
            {t('app.name')}
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted leading-tight">
            {t('app.issuer')}
          </p>
        </div>
      </header>
    );
  }

  return (
    <div
      className="
        flex items-center gap-2 rounded-full border border-ink/5 bg-canvas-soft
        px-3 py-1.5 text-[11px] text-ink-muted w-fit
      "
    >
      <img src="/dki.png" alt="" aria-hidden className="h-5 w-auto" />
      <span className="font-medium text-ink">{t('app.name')}</span>
      <span className="text-ink-subtle">·</span>
      <span>{t('app.issuer')}</span>
    </div>
  );
}

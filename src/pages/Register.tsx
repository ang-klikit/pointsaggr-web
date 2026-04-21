import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccountStore } from '@/store/account';
import { Button } from '@/components/ui/Button';
import { BrandHeader } from '@/components/BrandHeader';

const NAME_MIN = 2;
const PHONE_DIGITS_MIN = 6;
const PHONE_DIGITS_MAX = 16;

function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, '');
}

function isValidPhone(raw: string): boolean {
  const cleaned = normalizePhone(raw);
  if (!/^\+?\d+$/.test(cleaned)) return false;
  const digits = cleaned.replace(/^\+/, '');
  return digits.length >= PHONE_DIGITS_MIN && digits.length <= PHONE_DIGITS_MAX;
}

/**
 * Lightweight onboarding: capture name + phone so we can notify raffle winners
 * and personalize the profile. Data is local-only (zustand+localStorage) — no
 * backend contract yet.
 *
 * Nav behaviour:
 *   - `?next=/c/<payload>` → after save, redirect back with `autoclaim=1` so
 *     the claim auto-fires.
 *   - Any other `?next=` value → redirect back verbatim.
 *   - No `?next` → go home.
 */
export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const account = useAccountStore((s) => s.account);
  const save = useAccountStore((s) => s.save);

  const [fullName, setFullName] = useState(account?.fullName ?? '');
  const [phone, setPhone] = useState(account?.phone ?? '');
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  const next = search.get('next') ?? '/';
  const isEdit = account !== null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameOk = fullName.trim().length >= NAME_MIN;
    const phoneOk = isValidPhone(phone);
    if (!nameOk || !phoneOk) {
      setErrors({
        fullName: nameOk ? undefined : t('register.error_name'),
        phone: phoneOk ? undefined : t('register.error_phone'),
      });
      return;
    }
    save({ fullName, phone: normalizePhone(phone) });

    let target = next;
    if (!isEdit && target.startsWith('/c/') && !target.includes('autoclaim=')) {
      target += (target.includes('?') ? '&' : '?') + 'autoclaim=1';
    }
    navigate(target, { replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-6 px-5 pt-10 pb-8 safe-top">
      <header className="flex flex-col gap-3">
        <BrandHeader />
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {isEdit ? t('register.title_edit') : t('register.title')}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {isEdit ? t('register.subtitle_edit') : t('register.subtitle')}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field label={t('register.name_label')} error={errors.fullName}>
          <input
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
            }}
            placeholder={t('register.name_placeholder')}
            className={inputClass(!!errors.fullName)}
          />
        </Field>

        <Field
          label={t('register.phone_label')}
          error={errors.phone}
          hint={t('register.phone_hint')}
        >
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder={t('register.phone_placeholder')}
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Button type="submit" variant="primary" size="lg" fullWidth>
          {isEdit ? t('register.save') : t('register.continue')}
        </Button>

        {isEdit ? (
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            {t('register.cancel')}
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={() => navigate('/', { replace: true })}>
            {t('register.later')}
          </Button>
        )}
      </form>

      {!isEdit && (
        <p className="mt-auto text-center text-xs text-ink-muted">{t('register.privacy')}</p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'h-12 w-full rounded-xl border bg-canvas px-4 text-base text-ink',
    'placeholder:text-ink-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
    hasError ? 'border-danger/60' : 'border-ink/10 focus:border-brand-400',
  ].join(' ');
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
}

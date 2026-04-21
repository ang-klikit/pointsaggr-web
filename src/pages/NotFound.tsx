import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center safe-top">
      <p className="text-6xl font-bold tracking-tight text-ink-subtle">404</p>
      <h1 className="text-xl font-semibold">{t('not_found.title')}</h1>
      <Link
        to="/"
        className="
          inline-flex h-11 items-center justify-center rounded-xl bg-canvas-muted
          px-5 text-sm font-semibold text-ink hover:bg-ink/5
        "
      >
        {t('not_found.cta')}
      </Link>
    </div>
  );
}

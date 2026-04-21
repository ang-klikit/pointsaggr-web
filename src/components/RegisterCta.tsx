import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Takes the balance-card slot when the user has no account. Anchors the
 * home screen to a single action — "Register to enter the grand-prize
 * draw" — so first-time visitors see one clear next step alongside the
 * prize cards below.
 */
export function RegisterCta() {
  const { t } = useTranslation();

  return (
    <section
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700
        text-white shadow-hero
        px-6 pt-6 pb-6
      "
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
          {t('register_cta.kicker')}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight">
          {t('register_cta.title')}
        </h2>
        <p className="mt-2 max-w-[30ch] text-sm text-white/85">
          {t('register_cta.subtitle')}
        </p>

        <Link
          to="/me/register"
          className="
            mt-5 inline-flex h-11 items-center justify-center rounded-xl
            bg-white px-5 text-sm font-semibold text-brand-700
            shadow-lg shadow-black/10 transition hover:bg-brand-50
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
          "
        >
          {t('register_cta.cta')}
        </Link>
      </div>
    </section>
  );
}

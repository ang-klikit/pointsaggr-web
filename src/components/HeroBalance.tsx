import { useTranslation } from 'react-i18next';
import { formatPoints } from '@/lib/currency';

type Props = { total: number };

/**
 * Big gradient hero block that anchors the home screen. Styled to feel
 * premium (brand gradient, soft inner hero shadow) so the balance feels
 * like the main event, not an afterthought.
 */
export function HeroBalance({ total }: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl bg-gradient-to-br
        from-brand-500 via-brand-600 to-brand-700 text-white shadow-hero
        px-6 pt-7 pb-8
      "
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-white/5 blur-2xl" />

      <p className="text-sm font-medium text-white/80">{t('landing.balance')}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-6xl font-bold leading-none tracking-tight">
          {formatPoints(total)}
        </span>
        <span className="text-lg font-medium text-white/80">{t('landing.points')}</span>
      </div>
    </div>
  );
}

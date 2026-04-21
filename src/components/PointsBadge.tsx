import { formatPoints } from '@/lib/currency';
import { useTranslation } from 'react-i18next';

type Props = {
  points: number;
  size?: 'sm' | 'lg';
};

export function PointsBadge({ points, size = 'sm' }: Props) {
  const { t } = useTranslation();
  const isLg = size === 'lg';
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={[
          'font-bold tracking-tight',
          isLg ? 'text-6xl leading-none' : 'text-2xl leading-tight',
        ].join(' ')}
      >
        {formatPoints(points)}
      </span>
      <span
        className={[
          'font-medium text-ink-muted',
          isLg ? 'text-lg' : 'text-sm',
        ].join(' ')}
      >
        {t('landing.points')}
      </span>
    </div>
  );
}

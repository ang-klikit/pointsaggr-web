import { useTranslation } from 'react-i18next';
import { formatAmount } from '@/lib/currency';

type Props = {
  orderId: number;
  amountCents: number;
  currency: string;
  brand?: string;
  createdAt: number;
};

export function OrderSummaryCard({ orderId, amountCents, currency, brand, createdAt }: Props) {
  const { t, i18n } = useTranslation();
  const dateFmt = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt * 1000));

  return (
    <section
      aria-label={t('claim.order_summary')}
      className="rounded-2xl border border-ink/5 bg-canvas shadow-card p-5"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {t('claim.order_summary')}
      </h2>
      <dl className="mt-3 space-y-2.5 text-sm">
        {brand ? <Row label={t('claim.brand')} value={brand} /> : null}
        <Row label={t('claim.order_id')} value={`#${orderId}`} />
        <Row label={t('claim.amount')} value={formatAmount(amountCents, currency)} emphasized />
        <Row label={t('claim.date')} value={dateFmt} subtle />
      </dl>
    </section>
  );
}

function Row({
  label,
  value,
  emphasized,
  subtle,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  subtle?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd
        className={[
          'text-right font-medium',
          emphasized && 'text-base font-semibold text-ink',
          subtle && 'text-ink-subtle',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </dd>
    </div>
  );
}

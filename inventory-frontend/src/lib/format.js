import { CURRENCY, LOCALE } from '@/config';

const money = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 2,
});
const count = new Intl.NumberFormat(LOCALE);

export const formatMoney = (value) =>
  value === null || value === undefined || value === '' ? '—' : money.format(Number(value));

export const formatNumber = (value) =>
  value === null || value === undefined ? '—' : count.format(Number(value));

export function formatWarranty(months) {
  if (!months) return 'No warranty';
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  return `${months} months`;
}

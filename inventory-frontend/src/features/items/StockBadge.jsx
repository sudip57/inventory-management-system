import Badge from '@/components/ui/Badge';
import { stockStatus } from '@/lib/item';

const config = {
  in: { tone: 'success', label: 'In stock' },
  low: { tone: 'warn', label: 'Low stock' },
  out: { tone: 'danger', label: 'Out of stock' },
};

export default function StockBadge({ item }) {
  const { tone, label } = config[stockStatus(item)];
  return <Badge tone={tone}>{label}</Badge>;
}

import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { formatMoney, formatNumber } from '@/lib/format';
import { getCategoryName } from '@/lib/item';
import ItemThumb from './ItemThumb';
import StockBadge from './StockBadge';

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: 6 }).map((__, j) => (
        <td key={j}>
          <div className="h-4 animate-pulse rounded bg-ink-100" style={{ width: j === 0 ? '70%' : '55%' }} />
        </td>
      ))}
    </tr>
  ));
}

export default function ItemTable({ items, loading, onOpen, onStock, onEdit, onDelete }) {
  // Row buttons shouldn't also trigger the row's "open details" click.
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="overflow-x-auto">
      <table className="data-table min-w-[820px]">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Category</th>
            <th className="text-right">Price</th>
            <th>Stock</th>
            <th className="w-28" />
          </tr>
        </thead>
        <tbody>
          {loading && !items ? (
            <SkeletonRows />
          ) : (
            items.map((item) => (
              <tr key={item.id} className="is-clickable" onClick={() => onOpen(item)}>
                <td>
                  <div className="flex items-center gap-3">
                    <ItemThumb item={item} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{item.name}</p>
                      <p className="truncate text-[13px] text-ink-500">
                        {[item.brand, item.model].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="code-text">{item.sku}</td>
                <td className="text-ink-600">{getCategoryName(item) || <span className="text-ink-400">—</span>}</td>
                <td className="num text-right text-ink-900">{formatMoney(item.price)}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="num w-9 text-right font-medium text-ink-900">
                      {formatNumber(item.quantity ?? 0)}
                    </span>
                    <StockBadge item={item} />
                  </div>
                </td>
                <td>
                  <div className="flex justify-end gap-0.5">
                    <IconButton label={`Adjust stock for ${item.name}`} onClick={stop(() => onStock(item))}>
                      <ArrowUpDown size={15} />
                    </IconButton>
                    <IconButton label={`Edit ${item.name}`} onClick={stop(() => onEdit(item))}>
                      <Pencil size={15} />
                    </IconButton>
                    <IconButton label={`Delete ${item.name}`} tone="danger" onClick={stop(() => onDelete(item))}>
                      <Trash2 size={15} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

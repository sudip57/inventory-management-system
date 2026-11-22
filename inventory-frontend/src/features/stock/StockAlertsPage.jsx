import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { itemsApi } from '@/api/items';
import { useFetch } from '@/hooks/useFetch';
import { getCategoryName } from '@/lib/item';
import { formatNumber } from '@/lib/format';
import ItemThumb from '@/features/items/ItemThumb';
import StockModal from '@/features/items/StockModal';

export default function StockAlertsPage() {
  const [tab, setTab] = useState('low');
  const [restockItem, setRestockItem] = useState(null);

  const low = useFetch((signal) => itemsApi.lowStock(signal), []);
  const out = useFetch((signal) => itemsApi.outOfStock(signal), []);

  const active = tab === 'low' ? low : out;
  const items = active.data ?? [];

  function afterRestock() {
    setRestockItem(null);
    low.reload();
    out.reload();
  }

  return (
    <>
      <PageHeader title="Stock alerts" description="Items that need to be reordered or restocked." />

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'low', label: 'Low stock', count: low.data?.length },
          { id: 'out', label: 'Out of stock', count: out.data?.length },
        ]}
      />

      <div className="surface mt-5 overflow-hidden">
        {active.error && !active.data ? (
          <ErrorState error={active.error} onRetry={active.reload} />
        ) : active.loading && !active.data ? (
          <div className="flex justify-center py-14 text-ink-400">
            <Spinner className="h-5 w-5" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={tab === 'low' ? 'Nothing running low' : 'Nothing out of stock'}
            description="Stock levels look healthy for this list."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th className="text-right">On hand</th>
                  <th className="text-right">Reorder level</th>
                  <th className="w-32" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
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
                    <td className={`num text-right font-medium ${tab === 'out' ? 'text-danger-700' : 'text-warn-700'}`}>
                      {formatNumber(item.quantity ?? 0)}
                    </td>
                    <td className="num text-right text-ink-600">{formatNumber(item.minStockLevel ?? 0)}</td>
                    <td className="text-right">
                      <Button size="sm" onClick={() => setRestockItem(item)}>
                        <PackagePlus size={15} /> Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {restockItem && (
        <StockModal item={restockItem} initialMode="add" onClose={() => setRestockItem(null)} onDone={afterRestock} />
      )}
    </>
  );
}

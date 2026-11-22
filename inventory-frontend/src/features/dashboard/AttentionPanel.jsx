import { Link } from 'react-router-dom';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import ItemThumb from '@/features/items/ItemThumb';

const LIMIT = 6;

// A short list of items needing attention, with a link to the full list.
export default function AttentionPanel({ title, emptyText, result, showMin = false }) {
  const { data, loading, error, reload } = result;
  const items = data ?? [];

  return (
    <section className="surface flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5">
        <h3>{title}</h3>
        <Link to="/stock-alerts" className="text-[13px] font-medium">
          View all
        </Link>
      </div>

      {error && !data ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="flex justify-center py-10 text-ink-400">
          <Spinner className="h-5 w-5" />
        </div>
      ) : items.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-ink-200">
          {items.slice(0, LIMIT).map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
              <ItemThumb item={item} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">{item.name}</p>
                <p className="code-text truncate text-xs">{item.sku}</p>
              </div>
              <p className="num text-right text-[13px] text-ink-600">
                <span className="font-semibold text-ink-900">{item.quantity ?? 0}</span> left
                {showMin && <span className="block text-xs text-ink-400">min {item.minStockLevel ?? 0}</span>}
              </p>
            </li>
          ))}
        </ul>
      )}

      {items.length > LIMIT && (
        <p className="border-t border-ink-200 px-5 py-2.5 text-center text-xs text-ink-500">
          and {items.length - LIMIT} more
        </p>
      )}
    </section>
  );
}

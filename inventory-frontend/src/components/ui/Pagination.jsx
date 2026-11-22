import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZES } from '@/config';
import Button from './Button';

// `page` is zero-based, matching Spring's Pageable.
export default function Pagination({ page, size, totalElements, totalPages, onPage, onSize }) {
  if (!totalElements) return null;

  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col gap-3 border-t border-ink-200 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="num text-[13px]">
        Showing <strong>{from}–{to}</strong> of <strong>{totalElements}</strong>
      </p>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-ink-500">
          Rows
          <select
            className="control h-8 w-auto py-0 pl-2.5 pr-8 text-[13px]"
            value={size}
            onChange={(e) => onSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1.5">
          <Button size="sm" disabled={page <= 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
            <ChevronLeft size={15} />
          </Button>
          <span className="num min-w-[84px] text-center text-[13px] text-ink-600">
            Page {page + 1} of {Math.max(totalPages, 1)}
          </span>
          <Button
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => onPage(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

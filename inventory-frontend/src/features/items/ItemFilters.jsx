import { Search } from 'lucide-react';
import { Select } from '@/components/ui/Field';
import { useCategories } from '@/features/categories/CategoriesContext';

export const SORT_OPTIONS = [
  { value: 'name,asc', label: 'Name, A to Z' },
  { value: 'name,desc', label: 'Name, Z to A' },
  { value: 'price,asc', label: 'Price, low to high' },
  { value: 'price,desc', label: 'Price, high to low' },
  { value: 'quantity,asc', label: 'Stock, low to high' },
  { value: 'quantity,desc', label: 'Stock, high to low' },
];

export default function ItemFilters({ search, onSearch, categoryId, onCategory, sort, onSort }) {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col gap-3 border-b border-ink-200 p-4 md:flex-row md:items-center">
      <div className="relative md:max-w-sm md:flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, SKU, brand"
          aria-label="Search items"
          className="control pl-9"
        />
      </div>

      <div className="flex gap-3">
        <Select aria-label="Filter by category" value={categoryId} onChange={(e) => onCategory(e.target.value)} className="flex-1 md:w-48 md:flex-none">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select aria-label="Sort items" value={sort} onChange={(e) => onSort(e.target.value)} className="flex-1 md:w-48 md:flex-none">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

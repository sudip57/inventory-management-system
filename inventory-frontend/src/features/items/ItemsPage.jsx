import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { itemsApi } from '@/api/items';
import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGE_SIZE } from '@/config';
import ItemFilters from './ItemFilters';
import ItemTable from './ItemTable';
import ItemFormModal from './ItemFormModal';
import ItemDetailDrawer from './ItemDetailDrawer';
import StockModal from './StockModal';

export default function ItemsPage() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('name,asc');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  // Modal / drawer state
  const [form, setForm] = useState(null); // { item } where item may be null (create)
  const [stockItem, setStockItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const debouncedSearch = useDebounce(search.trim(), 300);

  const { data, loading, error, reload } = useFetch(
    (signal) => itemsApi.list({ search: debouncedSearch, categoryId, page, size, sort }, signal),
    [debouncedSearch, categoryId, page, size, sort]
  );

  // Dashboard links here with ?new=1 to open the "Add item" form.
  useEffect(() => {
    if (params.get('new')) {
      setForm({ item: null });
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  // Any filter change goes back to the first page.
  const withReset = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  const items = data?.content ?? null;
  const hasFilters = Boolean(debouncedSearch || categoryId);

  function afterSave(saved) {
    setForm(null);
    // Keep the open drawer in sync with the edited item.
    setDetailItem((current) => (current && saved && current.id === saved.id ? saved : current));
    reload();
  }

  function afterStock(updated) {
    setStockItem(null);
    setDetailItem((current) => (current && updated && current.id === updated.id ? updated : current));
    reload();
  }

  async function handleDelete() {
    await itemsApi.remove(deleteItem.id);
    toast.success(`Deleted “${deleteItem.name}”`);
    setDeleteItem(null);
    setDetailItem(null);
    // Step back a page if the last row on this page was just removed.
    if (items?.length === 1 && page > 0) setPage(page - 1);
    else reload();
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Every piece of hardware, with live stock levels."
        actions={
          <Button variant="primary" onClick={() => setForm({ item: null })}>
            <Plus size={16} /> Add item
          </Button>
        }
      />

      <div className="surface overflow-hidden">
        <ItemFilters
          search={search}
          onSearch={withReset(setSearch)}
          categoryId={categoryId}
          onCategory={withReset(setCategoryId)}
          sort={sort}
          onSort={withReset(setSort)}
        />

        {error && !items ? (
          <ErrorState error={error} onRetry={reload} />
        ) : items && items.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No items match your filters' : 'No items yet'}
            description={
              hasFilters
                ? 'Try a different search term or clear the category filter.'
                : 'Add your first piece of hardware to start tracking stock.'
            }
            action={
              !hasFilters && (
                <Button variant="primary" onClick={() => setForm({ item: null })}>
                  <Plus size={16} /> Add item
                </Button>
              )
            }
          />
        ) : (
          <div className={loading && items ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ItemTable
              items={items}
              loading={loading}
              onOpen={setDetailItem}
              onStock={setStockItem}
              onEdit={(item) => setForm({ item })}
              onDelete={setDeleteItem}
            />
          </div>
        )}

        {data && (
          <Pagination
            page={data.number ?? page}
            size={data.size ?? size}
            totalElements={data.totalElements ?? 0}
            totalPages={data.totalPages ?? 1}
            onPage={setPage}
            onSize={(s) => {
              setSize(s);
              setPage(0);
            }}
          />
        )}
      </div>

      {detailItem && (
        <ItemDetailDrawer
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onStock={setStockItem}
          onEdit={(item) => setForm({ item })}
          onDelete={setDeleteItem}
        />
      )}

      {form && <ItemFormModal item={form.item} onClose={() => setForm(null)} onSaved={afterSave} />}

      {stockItem && <StockModal item={stockItem} onClose={() => setStockItem(null)} onDone={afterStock} />}

      {deleteItem && (
        <ConfirmDialog
          title="Delete item"
          message={`“${deleteItem.name}” (${deleteItem.sku}) will be permanently removed, along with its image.`}
          confirmLabel="Delete item"
          onConfirm={handleDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </>
  );
}

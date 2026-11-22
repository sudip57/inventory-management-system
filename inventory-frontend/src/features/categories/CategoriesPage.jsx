import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { categoriesApi } from '@/api/categories';
import { useCategories } from './CategoriesContext';
import CategoryFormModal from './CategoryFormModal';

export default function CategoriesPage() {
  const { categories, loading, error, refresh } = useCategories();
  const toast = useToast();
  const [form, setForm] = useState(null); // { category } | null
  const [toDelete, setToDelete] = useState(null);

  async function handleDelete() {
    await categoriesApi.remove(toDelete.id);
    toast.success(`Deleted “${toDelete.name}”`);
    setToDelete(null);
    refresh();
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group hardware so it is easier to find and filter."
        actions={
          <Button variant="primary" onClick={() => setForm({ category: null })}>
            <Plus size={16} /> New category
          </Button>
        }
      />

      <div className="surface overflow-hidden">
        {error && !categories.length ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : loading && !categories.length ? (
          <div className="flex justify-center py-14 text-ink-400">
            <Spinner className="h-5 w-5" />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create categories like Laptops, Networking or Storage to organise your inventory."
            action={
              <Button variant="primary" onClick={() => setForm({ category: null })}>
                <Plus size={16} /> New category
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-1/3">Name</th>
                  <th>Description</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-ink-900">{c.name}</td>
                    <td className="text-ink-600">{c.description || <span className="text-ink-400">—</span>}</td>
                    <td>
                      <div className="flex justify-end gap-0.5">
                        <IconButton label={`Edit ${c.name}`} onClick={() => setForm({ category: c })}>
                          <Pencil size={15} />
                        </IconButton>
                        <IconButton label={`Delete ${c.name}`} tone="danger" onClick={() => setToDelete(c)}>
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && (
        <CategoryFormModal
          category={form.category}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            refresh();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete category"
          message={`“${toDelete.name}” will be removed. If items still use it, the server may refuse.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
}

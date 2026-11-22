import { useState } from 'react';
import clsx from 'clsx';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { itemsApi } from '@/api/items';
import ItemThumb from './ItemThumb';

// Receive stock (add) or issue stock (remove) for a single item.
export default function StockModal({ item, initialMode = 'add', onClose, onDone }) {
  const toast = useToast();
  const [mode, setMode] = useState(initialMode);
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const current = item.quantity ?? 0;
  const amount = /^\d+$/.test(quantity) ? parseInt(quantity, 10) : 0;
  const result = mode === 'add' ? current + amount : current - amount;
  const tooMany = mode === 'remove' && amount > current;
  const invalid = amount < 1 || tooMany;

  async function handleSubmit(e) {
    e.preventDefault();
    if (invalid) return;

    setSaving(true);
    setError('');
    try {
      const updated =
        mode === 'add' ? await itemsApi.addStock(item.id, amount) : await itemsApi.removeStock(item.id, amount);
      toast.success(mode === 'add' ? `Added ${amount} to stock` : `Removed ${amount} from stock`);
      onDone(updated);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title="Adjust stock" size="sm" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
        <ModalBody className="space-y-5">
          <div className="flex items-center gap-3">
            <ItemThumb item={item} />
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-900">{item.name}</p>
              <p className="code-text">{item.sku}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-md border border-ink-300 p-0.5 text-sm font-medium">
            {[
              ['add', 'Add stock'],
              ['remove', 'Remove stock'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={clsx(
                  'rounded py-1.5 transition-colors',
                  mode === value ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <Input
            label="Quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={tooMany ? `Only ${current} on hand` : undefined}
            autoFocus
          />

          <div className="flex items-center justify-between rounded-md bg-ink-100 px-3.5 py-2.5 text-sm">
            <span className="text-ink-600">On hand</span>
            <span className="num font-medium text-ink-900">
              {current}
              <span className="mx-2 text-ink-400">→</span>
              {invalid ? '—' : result}
            </span>
          </div>

          {error && <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p>}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={invalid}>
            {mode === 'add' ? 'Add stock' : 'Remove stock'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

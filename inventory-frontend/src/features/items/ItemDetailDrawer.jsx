import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { formatMoney, formatNumber, formatWarranty } from '@/lib/format';
import { getCategoryName } from '@/lib/item';
import ItemThumb from './ItemThumb';
import StockBadge from './StockBadge';

function Fact({ label, children }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="num mt-1 text-sm text-ink-900">{children}</dd>
    </div>
  );
}

export default function ItemDetailDrawer({ item, onClose, onStock, onEdit, onDelete }) {
  return (
    <Drawer
      title="Item details"
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="primary" className="flex-1" onClick={() => onStock(item)}>
            <ArrowUpDown size={15} /> Adjust stock
          </Button>
          <Button onClick={() => onEdit(item)}>
            <Pencil size={15} /> Edit
          </Button>
          <Button variant="ghost" className="text-danger-700 hover:bg-danger-50" onClick={() => onDelete(item)}>
            <Trash2 size={15} />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-6 py-6">
        <ItemThumb item={item} size="lg" />

        <div>
          <div className="mb-2">
            <StockBadge item={item} />
          </div>
          <h2>{item.name}</h2>
          <p className="mt-0.5 text-sm">{[item.brand, item.model].filter(Boolean).join(' · ') || 'No brand or model'}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-ink-200 py-5">
          <Fact label="SKU">
            <span className="code-text">{item.sku}</span>
          </Fact>
          <Fact label="Category">{getCategoryName(item) || '—'}</Fact>
          <Fact label="Price">{formatMoney(item.price)}</Fact>
          <Fact label="Warranty">{formatWarranty(item.defaultWarrantyMonths)}</Fact>
          <Fact label="On hand">{formatNumber(item.quantity ?? 0)}</Fact>
          <Fact label="Reorder level">{formatNumber(item.minStockLevel ?? 0)}</Fact>
        </dl>

        <div>
          <h4 className="mb-2">Description</h4>
          <p className="whitespace-pre-line text-sm">{item.description || 'No description added.'}</p>
        </div>
      </div>
    </Drawer>
  );
}

import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { itemsApi } from '@/api/items';
import { useFetch } from '@/hooks/useFetch';
import { useCategories } from '@/features/categories/CategoriesContext';
import StatStrip from './StatStrip';
import AttentionPanel from './AttentionPanel';

export default function DashboardPage() {
  const { categories } = useCategories();

  // size=1 is enough to read totalElements from the Spring page.
  const total = useFetch((signal) => itemsApi.list({ size: 1 }, signal), []);
  const low = useFetch((signal) => itemsApi.lowStock(signal), []);
  const out = useFetch((signal) => itemsApi.outOfStock(signal), []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick read on what is in the stockroom today."
        actions={
          <Link to="/inventory?new=1" className="no-underline hover:no-underline">
            <Button variant="primary">
              <Plus size={16} /> Add item
            </Button>
          </Link>
        }
      />

      <StatStrip
        stats={[
          { label: 'Total items', value: total.data?.totalElements, hint: 'Across all categories', to: '/inventory' },
          { label: 'Categories', value: categories.length, hint: 'Used to group hardware', to: '/categories' },
          { label: 'Low stock', value: low.data?.length, hint: 'At or below reorder level', to: '/stock-alerts', tone: 'warn' },
          { label: 'Out of stock', value: out.data?.length, hint: 'Nothing left on the shelf', to: '/stock-alerts', tone: 'danger' },
        ]}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttentionPanel title="Running low" emptyText="Nothing is running low." result={low} showMin />
        <AttentionPanel title="Out of stock" emptyText="Everything is in stock." result={out} />
      </div>
    </>
  );
}

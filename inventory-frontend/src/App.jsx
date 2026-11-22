import { Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';
import ItemsPage from '@/features/items/ItemsPage';
import CategoriesPage from '@/features/categories/CategoriesPage';
import StockAlertsPage from '@/features/stock/StockAlertsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<ItemsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="stock-alerts" element={<StockAlertsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

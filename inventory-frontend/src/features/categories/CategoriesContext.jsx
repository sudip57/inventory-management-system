import { createContext, useContext, useMemo } from 'react';
import { categoriesApi } from '@/api/categories';
import { useFetch } from '@/hooks/useFetch';

// Categories are needed by the item form, the item filters and the
// categories page, so they are fetched once and shared.
const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const { data, loading, error, reload } = useFetch((signal) => categoriesApi.list(signal), []);

  const value = useMemo(
    () => ({ categories: data ?? [], loading, error, refresh: reload }),
    [data, loading, error, reload]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export const useCategories = () => useContext(CategoriesContext);

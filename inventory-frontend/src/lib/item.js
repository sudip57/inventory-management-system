// Helpers that translate between API items and form state.

export const getCategoryId = (item) => item?.category?.id ?? item?.categoryId ?? null;
export const getCategoryName = (item) => item?.category?.name ?? item?.categoryName ?? null;

// 'in' | 'low' | 'out'
export function stockStatus(item) {
  const qty = item?.quantity ?? 0;
  if (qty <= 0) return 'out';
  if (item?.minStockLevel != null && qty <= item.minStockLevel) return 'low';
  return 'in';
}

export const emptyItemForm = {
  name: '',
  sku: '',
  brand: '',
  model: '',
  description: '',
  categoryId: '',
  price: '',
  quantity: '0',
  minStockLevel: '0',
  defaultWarrantyMonths: '0',
};

const str = (v) => (v === null || v === undefined ? '' : String(v));

export function toFormValues(item) {
  if (!item) return { ...emptyItemForm };
  return {
    name: str(item.name),
    sku: str(item.sku),
    brand: str(item.brand),
    model: str(item.model),
    description: str(item.description),
    categoryId: str(getCategoryId(item)),
    price: str(item.price),
    quantity: str(item.quantity ?? 0),
    minStockLevel: str(item.minStockLevel ?? 0),
    defaultWarrantyMonths: str(item.defaultWarrantyMonths ?? 0),
  };
}

const toInt = (v) => (v === '' || v === null ? null : parseInt(v, 10));

// Matches ItemRequest on the backend
export function toPayload(v) {
  return {
    name: v.name.trim(),
    sku: v.sku.trim(),
    brand: v.brand.trim() || null,
    model: v.model.trim() || null,
    description: v.description.trim() || null,
    categoryId: v.categoryId ? Number(v.categoryId) : null,
    price: Number(v.price),
    quantity: toInt(v.quantity),
    minStockLevel: toInt(v.minStockLevel),
    defaultWarrantyMonths: toInt(v.defaultWarrantyMonths),
  };
}

// Mirrors the Bean Validation rules in ItemRequest
export function validateItem(v) {
  const errors = {};
  const nonNegInt = (x) => /^\d+$/.test(String(x));

  if (!v.name.trim()) errors.name = 'Name is required';
  if (!v.sku.trim()) errors.sku = 'SKU is required';
  else if (v.sku.length > 100) errors.sku = 'SKU must be 100 characters or fewer';

  if (v.price === '') errors.price = 'Price is required';
  else if (Number.isNaN(Number(v.price)) || Number(v.price) < 0) errors.price = 'Price cannot be negative';

  if (v.quantity !== '' && !nonNegInt(v.quantity)) errors.quantity = 'Enter a whole number, 0 or more';
  if (v.minStockLevel !== '' && !nonNegInt(v.minStockLevel)) errors.minStockLevel = 'Enter a whole number, 0 or more';
  if (v.defaultWarrantyMonths !== '' && !nonNegInt(v.defaultWarrantyMonths))
    errors.defaultWarrantyMonths = 'Enter a whole number, 0 or more';

  if (v.description.length > 1000) errors.description = 'Description must be 1000 characters or fewer';

  return errors;
}

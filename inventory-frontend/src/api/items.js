import { API_BASE, request } from './client';

export const itemsApi = {
  // GET /api/items?search&categoryId&page&size&sort  -> Spring Page<Item>
  list: ({ search, categoryId, page = 0, size = 20, sort } = {}, signal) =>
    request('/items', { params: { search, categoryId, page, size, sort }, signal }),

  get: (id, signal) => request(`/items/${id}`, { signal }),

  // POST /api/items (multipart): part "item" = JSON, part "file" = optional image
  create(item, file) {
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return request('/items', { method: 'POST', formData });
  },

  update: (id, item) => request(`/items/${id}`, { method: 'PUT', json: item }),

  remove: (id) => request(`/items/${id}`, { method: 'DELETE' }),

  outOfStock: (signal) => request('/items/out-of-stock', { signal }),
  lowStock: (signal) => request('/items/low-stock', { signal }),

  addStock: (id, quantity) =>
    request(`/items/${id}/stock/add`, { method: 'POST', json: { quantity } }),

  removeStock: (id, quantity) =>
    request(`/items/${id}/stock/remove`, { method: 'POST', json: { quantity } }),

  uploadImage(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/items/${id}/image`, { method: 'POST', formData });
  },

  deleteImage: (id) => request(`/items/${id}/image`, { method: 'DELETE' }),
};

// The image endpoint streams bytes, so it is used directly as an <img src>.
// The file name is appended as a cache-buster so replaced images refresh.
export function imageUrl(item) {
  if (!item?.imageUrl) return null;
  return `${API_BASE}/items/${item.id}/image?v=${encodeURIComponent(item.imageFileName)}`;
}

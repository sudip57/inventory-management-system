import { request } from './client';

export const categoriesApi = {
  list: (signal) => request('/categories', { signal }),
  get: (id, signal) => request(`/categories/${id}`, { signal }),
  create: (data) => request('/categories', { method: 'POST', json: data }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', json: data }),
  remove: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

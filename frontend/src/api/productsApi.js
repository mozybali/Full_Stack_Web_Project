import api from './client';

export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Legacy exports for backward compatibility
export const fetchProducts = () => productsApi.getAll();
export const fetchProduct = (id) => productsApi.getById(id);

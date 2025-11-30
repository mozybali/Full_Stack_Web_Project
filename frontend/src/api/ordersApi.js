import api from './client';

export const ordersApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

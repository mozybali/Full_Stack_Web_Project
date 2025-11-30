import { create } from 'zustand';
import { ordersApi } from '../../api/ordersApi';

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ordersApi.getMyOrders();
      set({ orders: response.data });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Siparişler yüklenemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ordersApi.getAll();
      set({ orders: response.data });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Siparişler yüklenemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await ordersApi.getById(id);
      set({ currentOrder: response.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await ordersApi.create(data);
      set((state) => ({
        orders: [...state.orders, response.data],
        currentOrder: response.data,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}));

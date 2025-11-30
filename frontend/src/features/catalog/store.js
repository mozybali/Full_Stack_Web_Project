import { create } from 'zustand';
import { productsApi } from '../../api/productsApi';

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productsApi.getAll();
      set({ products: response.data });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ürünler yüklenemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await productsApi.getById(id);
      set({ currentProduct: response.data });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ürün yüklenemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await productsApi.create(data);
      set((state) => ({
        products: [...state.products, response.data],
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ürün oluşturulamadı';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await productsApi.update(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data : p)),
        currentProduct:
          state.currentProduct?.id === id ? response.data : state.currentProduct,
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ürün güncellenemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productsApi.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ürün silinemedi';
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));

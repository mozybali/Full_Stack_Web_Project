import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../../api/client';

const useProductStore = create(
  devtools(
    (set, get) => ({
      // State
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      filters: {
        type: null,
        priceMin: 0,
        priceMax: 10000,
        search: '',
      },
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
      },

      // Fetch all products
      fetchProducts: async (options = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/products', { params: options });
          const products = Array.isArray(response.data) ? response.data : response.data.data || [];
          set({ products, isLoading: false });
          return products;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to fetch products';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Fetch single product
      fetchProductById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/products/${id}`);
          set({ selectedProduct: response.data, isLoading: false });
          return response.data;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Product not found';
          set({ error: errorMsg, selectedProduct: null, isLoading: false });
          throw err;
        }
      },

      // Create product (seller)
      createProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/products', productData);
          const newProduct = response.data;
          set((state) => ({
            products: [newProduct, ...state.products],
            isLoading: false,
          }));
          return newProduct;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to create product';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Update product
      updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(`/products/${id}`, productData);
          const updatedProduct = response.data;
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            selectedProduct: state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct,
            isLoading: false,
          }));
          return updatedProduct;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to update product';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Delete product
      deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/products/${id}`);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
            isLoading: false,
          }));
          return true;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to delete product';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Set filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      // Clear filters
      clearFilters: () => {
        set({
          filters: {
            type: null,
            priceMin: 0,
            priceMax: 10000,
            search: '',
          },
        });
      },

      // Get filtered products
      getFilteredProducts: () => {
        const { products, filters } = get();
        return products.filter((product) => {
          const matchesSearch = !filters.search || product.title.toLowerCase().includes(filters.search.toLowerCase());
          const matchesType = !filters.type || product.type === filters.type;
          const matchesPrice = product.price >= filters.priceMin && product.price <= filters.priceMax;
          return matchesSearch && matchesType && matchesPrice;
        });
      },

      // Set pagination
      setPagination: (pagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        }));
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset state
      reset: () => {
        set({
          products: [],
          selectedProduct: null,
          isLoading: false,
          error: null,
          filters: {
            type: null,
            priceMin: 0,
            priceMax: 10000,
            search: '',
          },
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
          },
        });
      },
    }),
    { name: 'ProductStore' }
  )
);

export default useProductStore;

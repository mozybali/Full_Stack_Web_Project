import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../../api/client';

const useOrderStore = create(
  devtools(
    (set, get) => ({
      // State
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,
      filters: {
        status: null,
        dateFrom: null,
        dateTo: null,
      },

      // Create order
      createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/orders', orderData);
          const newOrder = response.data;
          set((state) => ({
            orders: [newOrder, ...state.orders],
            selectedOrder: newOrder,
            isLoading: false,
          }));
          return newOrder;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to create order';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Fetch user orders
      fetchMyOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/orders/my');
          const orders = Array.isArray(response.data) ? response.data : response.data.data || [];
          set({ orders, isLoading: false });
          return orders;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to fetch orders';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Fetch all orders (admin)
      fetchAllOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/orders');
          const orders = Array.isArray(response.data) ? response.data : response.data.data || [];
          set({ orders, isLoading: false });
          return orders;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to fetch orders';
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      // Fetch order by ID
      fetchOrderById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/orders/${id}`);
          set({ selectedOrder: response.data, isLoading: false });
          return response.data;
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Order not found';
          set({ error: errorMsg, selectedOrder: null, isLoading: false });
          throw err;
        }
      },

      // Set filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      // Clear filters
      clearFilters: () => {
        set({
          filters: {
            status: null,
            dateFrom: null,
            dateTo: null,
          },
        });
      },

      // Get filtered orders
      getFilteredOrders: () => {
        const { orders, filters } = get();
        return orders.filter((order) => {
          const matchesStatus = !filters.status || order.status === filters.status;
          const createdAt = new Date(order.createdAt);
          const matchesDateFrom = !filters.dateFrom || createdAt >= new Date(filters.dateFrom);
          const matchesDateTo = !filters.dateTo || createdAt <= new Date(filters.dateTo);
          return matchesStatus && matchesDateFrom && matchesDateTo;
        });
      },

      // Get order statistics
      getOrderStats: () => {
        const { orders } = get();
        const stats = {
          total: orders.length,
          pending: orders.filter((o) => o.status === 'PENDING').length,
          completed: orders.filter((o) => o.status === 'COMPLETED').length,
          cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
          totalSpent: orders.reduce((sum, order) => sum + Number(order.totalPrice), 0),
        };
        return stats;
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset state
      reset: () => {
        set({
          orders: [],
          selectedOrder: null,
          isLoading: false,
          error: null,
          filters: {
            status: null,
            dateFrom: null,
            dateTo: null,
          },
        });
      },
    }),
    { name: 'OrderStore' }
  )
);

export default useOrderStore;

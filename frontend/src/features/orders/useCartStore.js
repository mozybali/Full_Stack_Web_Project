import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        items: [],
        totalPrice: 0,
        totalQuantity: 0,

        // Add item to cart
        addItem: (product, quantity = 1) => {
          set((state) => {
            const existingItem = state.items.find((item) => item.id === product.id);

            let newItems;
            if (existingItem) {
              // Increase quantity if item already exists
              newItems = state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              );
            } else {
              // Add new item
              newItems = [...state.items, { ...product, quantity }];
            }

            return {
              items: newItems,
              ...get().calculateTotals(newItems),
            };
          });
        },

        // Remove item from cart
        removeItem: (productId) => {
          set((state) => {
            const newItems = state.items.filter((item) => item.id !== productId);
            return {
              items: newItems,
              ...get().calculateTotals(newItems),
            };
          });
        },

        // Update item quantity
        updateQuantity: (productId, quantity) => {
          set((state) => {
            let newItems;
            if (quantity <= 0) {
              newItems = state.items.filter((item) => item.id !== productId);
            } else {
              newItems = state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              );
            }
            return {
              items: newItems,
              ...get().calculateTotals(newItems),
            };
          });
        },

        // Clear cart
        clearCart: () => {
          set({
            items: [],
            totalPrice: 0,
            totalQuantity: 0,
          });
        },

        // Calculate totals
        calculateTotals: (items) => {
          const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
          return {
            totalQuantity,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
          };
        },

        // Get cart item count
        getItemCount: () => {
          const { items } = get();
          return items.length;
        },

        // Check if item in cart
        isItemInCart: (productId) => {
          const { items } = get();
          return items.some((item) => item.id === productId);
        },

        // Get item quantity
        getItemQuantity: (productId) => {
          const { items } = get();
          const item = items.find((item) => item.id === productId);
          return item?.quantity || 0;
        },

        // Prepare order data from cart
        getOrderData: () => {
          const { items } = get();
          return {
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          };
        },
      }),
      {
        name: 'gamevault-cart',
        partialize: (state) => ({
          items: state.items,
          totalPrice: state.totalPrice,
          totalQuantity: state.totalQuantity,
        }),
      }
    )
  )
);

export default useCartStore;

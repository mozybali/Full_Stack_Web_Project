import { useCallback } from 'react';
import useCartStore from '../../features/orders/useCartStore';
import useOrderStore from '../../features/orders/useOrderStore';
import useUIStore from '../stores/useUIStore';

/**
 * Hook for cart management
 */
export function useCart() {
  const {
    items,
    totalPrice,
    totalQuantity,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isItemInCart,
    getItemQuantity,
  } = useCartStore();
  const { addNotification } = useUIStore();

  const handleAddItem = useCallback(
    (product, quantity = 1) => {
      addItem(product, quantity);
      addNotification(`${product.title} added to cart`, 'success', 2000);
    },
    [addItem, addNotification]
  );

  const handleRemoveItem = useCallback(
    (productId, productTitle = 'Item') => {
      removeItem(productId);
      addNotification(`${productTitle} removed from cart`, 'info', 2000);
    },
    [removeItem, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId, quantity) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  return {
    items,
    totalPrice,
    totalQuantity,
    isEmpty: items.length === 0,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart,
    isItemInCart,
    getItemQuantity,
  };
}

/**
 * Hook for order management
 */
export function useOrders() {
  const {
    orders,
    isLoading,
    error,
    fetchMyOrders,
    fetchAllOrders,
    setFilters,
    getFilteredOrders,
    getOrderStats,
    clearError,
  } = useOrderStore();
  const { addNotification, setGlobalLoading } = useUIStore();

  const loadMyOrders = useCallback(async () => {
    setGlobalLoading(true);
    try {
      await fetchMyOrders();
    } catch (err) {
      addNotification('Failed to load your orders', 'error');
    } finally {
      setGlobalLoading(false);
    }
  }, [fetchMyOrders, addNotification, setGlobalLoading]);

  const loadAllOrders = useCallback(async () => {
    setGlobalLoading(true);
    try {
      await fetchAllOrders();
    } catch (err) {
      addNotification('Failed to load orders', 'error');
    } finally {
      setGlobalLoading(false);
    }
  }, [fetchAllOrders, addNotification, setGlobalLoading]);

  return {
    orders,
    filteredOrders: getFilteredOrders(),
    orderStats: getOrderStats(),
    isLoading,
    error,
    loadMyOrders,
    loadAllOrders,
    setFilters,
    clearError,
  };
}

/**
 * Hook for creating orders
 */
export function useCreateOrder() {
  const { createOrder, isLoading, error } = useOrderStore();
  const { addNotification, setGlobalLoading } = useUIStore();
  const { clearCart } = useCartStore();

  const handleCreateOrder = useCallback(
    async (orderData) => {
      setGlobalLoading(true);
      try {
        const result = await createOrder(orderData);
        addNotification('Order created successfully!', 'success');
        clearCart();
        return result;
      } catch (err) {
        addNotification(error || 'Failed to create order', 'error');
        throw err;
      } finally {
        setGlobalLoading(false);
      }
    },
    [createOrder, error, addNotification, clearCart, setGlobalLoading]
  );

  return {
    isLoading,
    error,
    createOrder: handleCreateOrder,
  };
}

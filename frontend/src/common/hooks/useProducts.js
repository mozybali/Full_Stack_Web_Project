import { useCallback, useEffect } from 'react';
import useProductStore from '../../features/catalog/useProductStore';
import useUIStore from '../stores/useUIStore';

/**
 * Hook for managing product fetching with loading state
 */
export function useProducts() {
  const { products, isLoading, error, fetchProducts, setFilters, getFilteredProducts } = useProductStore();
  const { setGlobalLoading } = useUIStore();

  const loadProducts = useCallback(async (options = {}) => {
    setGlobalLoading(true);
    try {
      await fetchProducts(options);
    } finally {
      setGlobalLoading(false);
    }
  }, [fetchProducts, setGlobalLoading]);

  return {
    products,
    filteredProducts: getFilteredProducts(),
    isLoading,
    error,
    loadProducts,
    setFilters,
  };
}

/**
 * Hook for managing single product
 */
export function useProduct(id) {
  const { selectedProduct, isLoading, error, fetchProductById } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  return {
    product: selectedProduct,
    isLoading,
    error,
  };
}

/**
 * Hook for managing product creation/update
 */
export function useProductForm() {
  const { createProduct, updateProduct, isLoading, error, clearError } = useProductStore();
  const { addNotification } = useUIStore();

  const handleCreateProduct = useCallback(
    async (productData) => {
      try {
        const result = await createProduct(productData);
        addNotification('Product created successfully', 'success');
        return result;
      } catch (err) {
        addNotification(error || 'Failed to create product', 'error');
        throw err;
      }
    },
    [createProduct, error, addNotification]
  );

  const handleUpdateProduct = useCallback(
    async (id, productData) => {
      try {
        const result = await updateProduct(id, productData);
        addNotification('Product updated successfully', 'success');
        return result;
      } catch (err) {
        addNotification(error || 'Failed to update product', 'error');
        throw err;
      }
    },
    [updateProduct, error, addNotification]
  );

  return {
    isLoading,
    error,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    clearError,
  };
}

/**
 * Store exports
 * Centralized store access
 */

export { default as useAuthStore } from '../../features/auth/useAuthStore';
export { default as useProductStore } from '../../features/catalog/useProductStore';
export { default as useCartStore } from '../../features/orders/useCartStore';
export { default as useOrderStore } from '../../features/orders/useOrderStore';
export { default as useUIStore } from './useUIStore';

// Store utilities
export { 
  createStoreSelector, 
  resetAllStores, 
  subscribeToStores,
  combineSelectors,
  createDerivedSelector,
  persistMultipleStores,
  createPersistConfig,
} from './storeUtils';

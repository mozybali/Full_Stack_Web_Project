/**
 * Store utilities and helper functions
 */

/**
 * Create a combined store selector
 * Useful for selecting multiple stores data
 */
export const createStoreSelector = (...stores) => () => {
  return stores.reduce((acc, store) => ({ ...acc, ...store() }), {});
};

/**
 * Reset all stores
 */
export const resetAllStores = (stores) => {
  stores.forEach((store) => {
    if (store.reset) {
      store.reset();
    }
  });
};

/**
 * Subscribe to multiple stores
 */
export const subscribeToStores = (stores, callback) => {
  const unsubscribers = stores.map((store) =>
    store.subscribe(() => {
      callback();
    })
  );

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
};

/**
 * Combine selectors from multiple stores
 */
export const combineSelectors = (selectors) => (state) => {
  return Object.keys(selectors).reduce((acc, key) => {
    acc[key] = selectors[key](state);
    return acc;
  }, {});
};

/**
 * Create a derived selector that combines multiple store selectors
 */
export const createDerivedSelector = (store, dependencies, selector) => (state) => {
  const depValues = dependencies.map((dep) => store(dep));
  return selector(...depValues);
};

/**
 * Persist multiple stores to localStorage
 */
export const persistMultipleStores = (stores, storeName) => {
  return {
    getSnapshot: () => {
      return stores.reduce((acc, store) => {
        const state = store.getState();
        acc[store.name] = state;
        return acc;
      }, {});
    },
    subscribe: (callback) => {
      const unsubscribers = stores.map((store) =>
        store.subscribe(() => {
          callback();
        })
      );
      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    },
  };
};

/**
 * Create a store with automatic persist configuration
 */
export const createPersistConfig = (storeName, options = {}) => {
  return {
    name: storeName,
    partialize: options.partialize || ((state) => state),
    onRehydrateStorage: options.onRehydrateStorage,
    version: options.version || 1,
    ...options,
  };
};

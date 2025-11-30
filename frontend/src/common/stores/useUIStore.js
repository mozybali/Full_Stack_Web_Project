import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI State Yönetim Store'u
 * Global UI durumunu (yükleme, modal'lar, bildirimler, vb.) yönetir
 */
const useUIStore = create(
  devtools(
    (set) => ({
      // ===================== YÜKLEME DURUMU =====================
      // Küresel yükleme göstericisi
      isGlobalLoading: false,
      setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),

      // ===================== MODAL DURUMLAR =====================
      // Modal açık/kapalı durumları
      modals: {
        confirmDelete: false,
        confirmAction: false,
        productForm: false,
        userForm: false,
      },

      /**
       * Modal'ı aç
       * @param {string} modalName - Açılacak modal adı
       */
      openModal: (modalName) => {
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
        }));
      },

      /**
       * Modal'ı kapat
       * @param {string} modalName - Kapatılacak modal adı
       */
      closeModal: (modalName) => {
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
        }));
      },

      /**
       * Tüm modal'ları kapat
       */
      closeAllModals: () => {
        set({
          modals: {
            confirmDelete: false,
            confirmAction: false,
            productForm: false,
            userForm: false,
          },
        });
      },

      // ===================== BİLDİRİMLER =====================
      // Bildirim kuyruk listesi
      notifications: [],

      /**
       * Bildirim ekle (toast mesajı)
       * @param {string} message - Bildirim mesajı
       * @param {string} type - Bildirim tipi (info, success, error, warning)
       * @param {number} duration - Gösterim süresi (ms), 0 = manuel kapatılmalı
       * @returns {number} - Bildirim ID'si
       */
      addNotification: (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        set((state) => ({
          notifications: [...state.notifications, { id, message, type, duration }],
        }));

        // Belirtilen süreden sonra otomatik kaldır
        if (duration > 0) {
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          }, duration);
        }

        return id;
      },

      /**
       * Bildirim kaldır
       * @param {number} id - Bildirim ID'si
       */
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      /**
       * Tüm bildirimleri temizle
       */
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // ===================== SİDEBAR =====================
      // Mobil sidebar açık/kapalı durumu
      isSidebarOpen: false,
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      closeSidebar: () => set({ isSidebarOpen: false }),

      // ===================== SAYFALANDIRMA =====================
      // Mevcut sayfa numarası
      currentPage: 1,
      // Sayfa başına ürün sayısı
      itemsPerPage: 12,
      /**
       * Sayfa numarasını ayarla
       * @param {number} page - Sayfa numarası
       */
      setCurrentPage: (page) => set({ currentPage: page }),
      /**
       * Sayfa başına gösterilecek ürün sayısını ayarla
       * @param {number} items - Sayfa başına ürün sayısı
       */
      setItemsPerPage: (items) => set({ itemsPerPage: items }),

      // ===================== ARAMA =====================
      // Arama sorgusu
      searchQuery: '',
      /**
       * Arama sorgusu ayarla
       * @param {string} query - Arama metni
       */
      setSearchQuery: (query) => set({ searchQuery: query }),
      /**
       * Arama sorgusu temizle
       */
      clearSearchQuery: () => set({ searchQuery: '' }),

      // ===================== SIRALAMA =====================
      // Sıralama kriterleri
      sortBy: 'latest',
      sortOrder: 'desc',
      /**
       * Sıralamayı ayarla
       * @param {string} sortBy - Hangi alan'a göre
       * @param {string} sortOrder - Sıralama yönü (asc/desc)
       */
      setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

      // ===================== FİLTRELER =====================
      // Filtre paneli açık/kapalı
      isFilterOpen: false,
      /**
       * Filtre panelini aç/kapat
       */
      toggleFilterPanel: () => {
        set((state) => ({ isFilterOpen: !state.isFilterOpen }));
      },
      /**
       * Filtre panelini kapat
       */
      closeFilterPanel: () => set({ isFilterOpen: false }),
    }),
    { name: 'UIStore' }
  )
);

export default useUIStore;

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../../api/client';

const saved = localStorage.getItem('gamevault_user');

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: saved ? JSON.parse(saved) : null,
        token: localStorage.getItem('gamevault_token') || null,
        isLoading: false,
        error: null,

        // Login
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post('/auth/login', { email, password });
            const { user, accessToken } = response.data;
            
            localStorage.setItem('gamevault_user', JSON.stringify(user));
            localStorage.setItem('gamevault_token', accessToken);
            
            set({ user, token: accessToken, isLoading: false });
            return { success: true };
          } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
          }
        },

        // Register
        register: async (email, username, password) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post('/auth/register', { email, username, password });
            const { user, accessToken } = response.data;
            
            localStorage.setItem('gamevault_user', JSON.stringify(user));
            localStorage.setItem('gamevault_token', accessToken);
            
            set({ user, token: accessToken, isLoading: false });
            return { success: true };
          } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
          }
        },

        // Logout
        logout: () => {
          localStorage.removeItem('gamevault_user');
          localStorage.removeItem('gamevault_token');
          set({ user: null, token: null, error: null });
        },

        // Update user
        updateUser: (updatedUser) => {
          localStorage.setItem('gamevault_user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Check if user has role
        hasRole: (role) => {
          const { user } = get();
          return user?.roles?.includes(role) || false;
        },

        // Check if authenticated
        isAuthenticated: () => !!get().user,
      }),
      {
        name: 'gamevault-auth',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
);

export default useAuthStore;

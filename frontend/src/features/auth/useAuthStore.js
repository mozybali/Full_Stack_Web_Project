import { create } from 'zustand';

const saved = localStorage.getItem('gamevault_user');

const useAuthStore = create((set) => ({
  user: saved ? JSON.parse(saved) : null,
  token: localStorage.getItem('gamevault_token') || null,
  login: (user, token) => {
    localStorage.setItem('gamevault_user', JSON.stringify(user));
    localStorage.setItem('gamevault_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('gamevault_user');
    localStorage.removeItem('gamevault_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;

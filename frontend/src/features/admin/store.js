import { create } from 'zustand';
import { gamesApi } from '../../api/gamesApi';

export const useGameStore = create((set, get) => ({
  games: [],
  currentGame: null,
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const response = await gamesApi.getAll();
      set({ games: response.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchGameById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await gamesApi.getById(id);
      set({ currentGame: response.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createGame: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await gamesApi.create(data);
      set((state) => ({
        games: [...state.games, response.data],
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateGame: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await gamesApi.update(id, data);
      set((state) => ({
        games: state.games.map((g) => (g.id === id ? response.data : g)),
        currentGame:
          state.currentGame?.id === id ? response.data : state.currentGame,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteGame: async (id) => {
    set({ loading: true, error: null });
    try {
      await gamesApi.delete(id);
      set((state) => ({
        games: state.games.filter((g) => g.id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentGame: () => set({ currentGame: null }),
}));

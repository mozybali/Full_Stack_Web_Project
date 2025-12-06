import { useState, useEffect } from 'react';
import { gameService } from '../services/game.service';
import type { Game } from '../types';

/**
 * Oyunları yönetmek için custom hook
 * 
 * Kullanım:
 * const { games, loading, error, refetch } = useGames();
 * 
 * @returns {Object} Oyun verileri ve durumları
 * @returns {Game[]} games - Tüm oyunlar
 * @returns {boolean} loading - Yükleme durumu
 * @returns {string|null} error - Hata mesajı
 * @returns {Function} refetch - Verileri yeniden yükle
 */
export const useGames = () => {
  // State tanımlamaları
  const [games, setGames] = useState<Game[]>([]); // Tüm oyunlar
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [error, setError] = useState<string | null>(null); // Hata durumu

  // Oyunları API'den yükle
  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameService.getAll();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oyunlar yüklenirken hata oluştu');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return {
    games,
    loading,
    error,
    refetch: loadGames,
  };
};

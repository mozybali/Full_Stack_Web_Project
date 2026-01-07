import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/game.service';
import { useToast } from '../ui/ToastContainer';
import type { Game, CreateGameDto } from '../../types';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();
  const [formData, setFormData] = useState<CreateGameDto>({
    name: '',
    platform: '',
    genre: '',
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await gameService.getAll();
      setGames(data);
    } catch (error) {
      console.error('Oyunlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await gameService.update(editingGame.id, formData);
        addToast('Oyun başarıyla güncellendi', 'success');
      } else {
        await gameService.create(formData);
        addToast('Oyun başarıyla oluşturuldu', 'success');
      }
      
      setShowModal(false);
      resetForm();
      loadGames();
    } catch (error: any) {
      const message = error.response?.data?.message || 'İşlem başarısız';
      addToast(message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu oyunu silmek istediğinizden emin misiniz?')) return;
    
    try {
      await gameService.delete(id);
      addToast('Oyun başarıyla silindi', 'success');
      loadGames();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Silme başarısız';
      addToast(message, 'error');
    }
  };

  const openModal = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        name: game.name,
        platform: game.platform,
        genre: game.genre || '',
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingGame(null);
    setFormData({
      name: '',
      platform: '',
      genre: '',
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Yükleniyor...</div>;
  }

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Oyunlar</h2>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Yeni Oyun</span>
        </button>
      </div>

      {/* Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Oyun adı veya platform ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full md:w-96"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Oyun Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tür</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGames.map((game) => (
              <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{game.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{game.name}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{game.platform}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{game.genre || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openModal(game)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(game.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredGames.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Oyun bulunamadı</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              {editingGame ? 'Oyun Düzenle' : 'Yeni Oyun'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Oyun Adı</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Platform</label>
                <input
                  type="text"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="input-field"
                  placeholder="PC, PS5, Xbox, vb."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Tür (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="input-field"
                  placeholder="Action, RPG, vb."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingGame ? 'Güncelle' : 'Oluştur'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;

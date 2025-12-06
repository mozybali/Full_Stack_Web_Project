import React, { useState, useEffect } from 'react';
import { productService } from '../../services/product.service';
import { gameService } from '../../services/game.service';
import type { Product, Game, CreateProductDto, ProductType } from '../../types';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    title: '',
    description: '',
    type: 'KEY' as ProductType,
    price: 0,
    stock: 1,
    gameId: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, gamesData] = await Promise.all([
        productService.getAll(),
        gameService.getAll(),
      ]);
      setProducts(productsData);
      setGames(gamesData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, image: imageFile || undefined };
      
      if (editingProduct) {
        await productService.update(editingProduct.id, dataToSend);
      } else {
        await productService.create(dataToSend);
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      await productService.delete(id);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silme başarısız');
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description || '',
        type: product.type,
        price: product.price,
        stock: product.stock,
        gameId: product.game.id,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      type: 'KEY' as ProductType,
      price: 0,
      stock: 1,
      gameId: games[0]?.id || 0,
    });
    setImageFile(null);
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ürünler</h2>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Yeni Ürün</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oyun</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <img
                    src={product.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${product.imageUrl}` : 'https://via.placeholder.com/50'}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">{product.game.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${product.type === 'KEY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4">₺{product.price.toFixed(2)}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Oyun</label>
                <select
                  required
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value="">Oyun Seçin</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name} ({game.platform})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tip</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                  className="input-field"
                >
                  <option value="KEY">Key</option>
                  <option value="ACCOUNT">Hesap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fiyat (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stok</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resim</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Güncelle' : 'Oluştur'}
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

export default AdminProducts;

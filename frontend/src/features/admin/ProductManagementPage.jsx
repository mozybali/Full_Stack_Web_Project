import React, { useEffect, useState } from 'react';
import { useProductStore } from '../catalog/store';
import { useGameStore } from './store';
import { Modal, Alert, Loading } from '../../common/ui';

export default function ProductManagementPage() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  } = useProductStore();

  const { games, fetchGames } = useGameStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'KEY',
    price: '',
    stock: '',
    gameId: '',
  });
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchGames();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description || '',
        type: product.type,
        price: product.price,
        stock: product.stock,
        gameId: product.game?.id,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        type: 'KEY',
        price: '',
        stock: '',
        gameId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'İşlem başarısız oldu');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        setSubmitError(err.response?.data?.message || 'Ürün silinemedi');
      }
    }
  };

  if (loading) return <Loading text="Ürünler yükleniyor..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ürün Yönetimi</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium"
        >
          + Yeni Ürün
        </button>
      </div>

      {error && (
        <Alert
          type="error"
          title="Hata"
          message={error}
          onClose={clearError}
        />
      )}

      {submitError && (
        <Alert
          type="error"
          title="Hata"
          message={submitError}
          onClose={() => setSubmitError(null)}
        />
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-slate-400">Ürün bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4"
            >
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                {product.game?.name} · {product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
              </p>
              <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fiyat:</span>
                  <span className="text-indigo-400 font-semibold">
                    {Number(product.price).toFixed(2)} TRY
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stok:</span>
                  <span>{product.stock}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.title)}
                  className="flex-1 px-3 py-2 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ürün Adı *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tür *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
              >
                <option value="KEY">Key</option>
                <option value="ACCOUNT">Hesap</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Oyun *</label>
              <select
                name="gameId"
                value={formData.gameId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
              >
                <option value="">Seçiniz</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fiyat *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stok *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md"
            >
              {editingProduct ? 'Güncelle' : 'Oluştur'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md"
            >
              İptal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

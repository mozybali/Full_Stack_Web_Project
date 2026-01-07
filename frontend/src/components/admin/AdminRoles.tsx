/**
 * Admin Roles Management Component
 * Sistem rollerini yönet (CRUD işlemleri)
 */

import React, { useState } from 'react';
import { useToast } from '../ui/ToastContainer';
import type { Role } from '../../types';
import { RoleNames } from '../../types';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Mock data - Backend API'si implemente edilmediyse
const mockRoles: Role[] = [
  {
    id: 1,
    name: RoleNames.ADMIN,
    description: 'Tam yönetim yetkisi, tüm işlemleri yapabilir',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: RoleNames.SELLER,
    description: 'Satıcı, ürünlerini yönetebilir',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: RoleNames.BUYER,
    description: 'Alıcı, ürün satın alabilir',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface RoleFormData {
  name: string;
  description: string;
}

const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [loading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
  });

  // TODO: Backend API'si hazır olunca bu fonksiyonları implement et
  // const loadRoles = async () => {
  //   try {
  //     setLoading(true);
  //     // const response = await rolesService.getAll();
  //     // setRoles(response);
  //     setRoles(mockRoles);
  //   } catch (error) {
  //     addToast('Roller yüklenemedi', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addToast('Rol adı zorunludur', 'error');
      return;
    }

    try {
      if (editingRole) {
        // await rolesService.update(editingRole.id, formData);
        setRoles(
          roles.map((role) =>
            role.id === editingRole.id
              ? {
                  ...role,
                  name: role.name,
                  description: formData.description,
                  updatedAt: new Date().toISOString(),
                }
              : role
          )
        );
        addToast('Rol başarıyla güncellendi', 'success');
      } else {
        // await rolesService.create(formData);
        // Mock: Gerçek backend'e yazılmadığı için basit bir rol oluşturma
        addToast('Yeni roller backend entegrasyonu sonrası eklenebilecek', 'info');
        resetForm();
        setShowModal(false);
        return;
      }
      
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      const message = error.response?.data?.message || 'İşlem başarısız';
      addToast(message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu rolü silmek istediğinizden emin misiniz?')) return;

    try {
      // await rolesService.delete(id);
      setRoles(roles.filter((role) => role.id !== id));
      addToast('Rol başarıyla silindi', 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Silme başarısız';
      addToast(message, 'error');
    }
  };

  const openModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Roller</h2>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Yeni Rol</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rol Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Oluşturma Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{role.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{role.name}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{role.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(role)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      disabled={['ADMIN', 'SELLER', 'BUYER'].includes(role.name)}
                      title={['ADMIN', 'SELLER', 'BUYER'].includes(role.name) ? 'Sistem rolü düzenlenemez' : 'Düzenle'}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={['ADMIN', 'SELLER', 'BUYER'].includes(role.name)}
                      title={['ADMIN', 'SELLER', 'BUYER'].includes(role.name) ? 'Sistem rolü silinemez' : 'Sil'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roles.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Rol bulunamadı</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              {editingRole ? 'Rol Düzenle' : 'Yeni Rol'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Rol Adı</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Örn: MODERATOR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Rol açıklaması..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingRole ? 'Güncelle' : 'Oluştur'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
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

export default AdminRoles;

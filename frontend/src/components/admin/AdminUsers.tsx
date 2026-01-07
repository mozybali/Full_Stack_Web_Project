import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { useToast } from '../ui/ToastContainer';
import type { User } from '../../types';
import { FaTrash, FaEdit } from 'react-icons/fa';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await userService.delete(id);
      addToast('Kullanıcı başarıyla silindi', 'success');
      loadUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Silme başarısız';
      addToast(message, 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Yükleniyor...</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Kullanıcılar</h2>

      {/* Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Kullanıcı adı veya email ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full md:w-96"
        />
      </div>

      {/* Kullanıcılar Tablosu */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Kullanıcı Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Roller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{user.username}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className={`px-2 py-1 rounded text-xs ${
                          role.name === 'ADMIN'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : role.name === 'SELLER'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Rollerini Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Kullanıcı bulunamadı</div>
        )}
      </div>

      {/* Kullanıcı Detayları Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">Kullanıcı Detayları</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kullanıcı Adı</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedUser.username}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Roller</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.roles.map((role) => (
                  <span
                    key={role.id}
                    className={`px-3 py-1 rounded text-sm ${
                      role.name === 'ADMIN'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : role.name === 'SELLER'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Kayıt Tarihi</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
              💡 Rol yönetimi özellikleri yakında eklenecektir.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-medium py-2 rounded"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

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
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kullanıcılar</h2>

      {/* Arama */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Kullanıcı adı veya email ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full md:w-96"
        />
      </div>

      {/* Kullanıcılar Tablosu */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4 font-semibold">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className={`px-2 py-1 rounded text-xs ${
                          role.name === 'ADMIN'
                            ? 'bg-red-100 text-red-800'
                            : role.name === 'SELLER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Rollerini Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
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
          <div className="text-center py-8 text-gray-500">Kullanıcı bulunamadı</div>
        )}
      </div>

      {/* Kullanıcı Detayları Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Kullanıcı Detayları</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Kullanıcı Adı</p>
              <p className="font-semibold">{selectedUser.username}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Roller</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.roles.map((role) => (
                  <span
                    key={role.id}
                    className={`px-3 py-1 rounded text-sm ${
                      role.name === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : role.name === 'SELLER'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500">Kayıt Tarihi</p>
              <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>

            <p className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded">
              💡 Rol yönetimi özellikleri yakında eklenecektir.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded"
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

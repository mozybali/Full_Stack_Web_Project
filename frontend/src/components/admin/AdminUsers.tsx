import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import type { User } from '../../types';
import { FaTrash } from 'react-icons/fa';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silme başarısız');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kullanıcılar</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
            {users.map((user) => (
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
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

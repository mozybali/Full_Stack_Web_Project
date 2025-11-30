import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/usersApi';
import { Loading, Alert } from '../../common/ui';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) {
      try {
        await usersApi.delete(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        setDeleteError(err.response?.data?.message || 'Kullanıcı silinemedi');
      }
    }
  };

  if (loading) return <Loading text="Kullanıcılar yükleniyor..." />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Kullanıcı Yönetimi</h1>

      {error && (
        <Alert
          type="error"
          title="Hata"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {deleteError && (
        <Alert
          type="error"
          title="Hata"
          message={deleteError}
          onClose={() => setDeleteError(null)}
        />
      )}

      {users.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-slate-400">Kullanıcı bulunamadı</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">E-posta</th>
                <th className="px-4 py-3 font-semibold">Kullanıcı Adı</th>
                <th className="px-4 py-3 font-semibold">Roller</th>
                <th className="px-4 py-3 font-semibold">Kayıt Tarihi</th>
                <th className="px-4 py-3 font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-800 hover:bg-slate-900/50"
                >
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 text-indigo-400">{user.email}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.roles?.map((role) => (
                        <span
                          key={role.id}
                          className="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

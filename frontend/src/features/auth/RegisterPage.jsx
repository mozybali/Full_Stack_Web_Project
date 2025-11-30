import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import useAuthStore from './useAuthStore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerApi(email, username, password);
      login(res.data.user, res.data.accessToken);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Kayıt başarısız. Bilgileri kontrol edin.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">E-posta</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Kullanıcı adı</label>
          <input
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Şifre</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
        >
          Kayıt Ol
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="text-indigo-400">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}

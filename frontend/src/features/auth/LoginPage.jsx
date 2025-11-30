import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../api/authApi';
import useAuthStore from './useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginApi(email, password);
      login(res.data.user, res.data.accessToken);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Giriş başarısız. Bilgileri kontrol edin.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Giriş Yap</h1>
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
          Giriş Yap
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Hesabın yok mu?{' '}
        <Link to="/register" className="text-indigo-400">
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}

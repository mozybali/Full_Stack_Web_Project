import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { useForm } from '../../common/hooks/useForm';
import { useValidation } from '../../common/hooks/useValidation';
import useAuthStore from './useAuthStore';
import { Alert } from '../../common/ui';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { validateEmail, validatePassword, validateUsername } = useValidation();
  const [apiError, setApiError] = useState('');

  const { values, errors, handleChange, handleSubmit, isSubmitting, setFieldError } = useForm(
    { email: '', username: '', password: '' },
    async (formValues) => {
      setApiError('');

      // Validation
      if (!validateEmail(formValues.email)) {
        setFieldError('email', 'Geçerli bir e-posta adresi giriniz');
        return;
      }
      if (!validateUsername(formValues.username)) {
        setFieldError('username', 'Kullanıcı adı 3-20 karakter arası olmalıdır');
        return;
      }
      if (!validatePassword(formValues.password)) {
        setFieldError('password', 'Şifre en az 6 karakter olmalıdır');
        return;
      }

      try {
        const res = await registerApi(formValues.email, formValues.username, formValues.password);
        login(res.data.user, res.data.accessToken);
        navigate('/', { replace: true });
      } catch (err) {
        setApiError(err.response?.data?.message || 'Kayıt başarısız. Bilgileri kontrol edin.');
      }
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-1">Kayıt Ol</h1>
        <p className="text-sm text-slate-400 mb-6">Yeni bir hesap oluşturun</p>

        {apiError && (
          <Alert
            type="error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">E-posta</label>
            <input
              type="email"
              name="email"
              className={`w-full px-3 py-2 rounded-md bg-slate-950 border text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
              value={values.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              className={`w-full px-3 py-2 rounded-md bg-slate-950 border text-sm focus:outline-none transition-colors ${
                errors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
              value={values.username}
              onChange={handleChange}
              placeholder="kullaniciadi"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Şifre</label>
            <input
              type="password"
              name="password"
              className={`w-full px-3 py-2 rounded-md bg-slate-950 border text-sm focus:outline-none transition-colors ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}

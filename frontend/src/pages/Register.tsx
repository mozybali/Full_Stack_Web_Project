/**
 * Kayıt (Register) Sayfası
 * 
 * Yeni kullanıcıların hesap oluşturmasını sağlayan sayfa.
 * Email, kullanıcı adı ve şifre ile yeni hesap oluşturur.
 * 
 * Özellikler:
 * - Kullanıcı adı girişi
 * - Email girişi
 * - Şifre girişi ve doğrulama
 * - Şifre eşleşme kontrolü
 * - Minimum şifre uzunluğu kontrolü (6 karakter)
 * - Giriş yapmış kullanıcılar için otomatik ana sayfaya yönlendirme
 * - Hata mesajları gösterme
 * - Yükleme durumu göstergesi
 * 
 * Kullanılan Context'ler:
 * - useAuth: Kayıt işlemi ve kimlik kontrol
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterDto } from '../types';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const Register: React.FC = () => {
  const navigate = useNavigate();
  // Auth context'ten kayıt fonksiyonu ve durum al
  const { register, isAuthenticated } = useAuth();
  
  // Kayıt formunun input alanları
  const [formData, setFormData] = useState<RegisterDto>({
    email: '',
    username: '',
    password: '',
  });
  // Şifre doğrulama alanı
  const [confirmPassword, setConfirmPassword] = useState('');
  // Hata mesajı state
  const [error, setError] = useState('');
  // Kayıt işlemi yükleniyor mu?
  const [loading, setLoading] = useState(false);

  // Zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Form input'larını handle et
   * Yazılan değerleri state'e kaydet
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Kayıt formunu gönder
   * 1. Şifreler eşleşiyor mu kontrol et
   * 2. Şifre uzunluğu (minimum 6 karakter)
   * 3. Kayıt işlemi yap
   * 4. Başarılı ise ana sayfaya yönlendir
   * 5. Hata varsa göster
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Şifreler eşleşiyor mu kontrol et
    if (formData.password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    // Minimum şifre uzunluğu kontrol et
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      // Kayıt işlemini gerçekleştir
      await register(formData);
      // Başarılı olursa ana sayfaya yönlendir
      navigate('/');
    } catch (err: any) {
      // Hata mesajını göster
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Sayfa Başlığı */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Kayıt Ol</h2>
            <p className="mt-2 text-gray-600">GamerMarkt'a katılın</p>
          </div>

          {/* Hata Mesajı (varsa göster) */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Kayıt Formu */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı Adı */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="kullaniciadi"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Şifre Doğrulama */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Kayıt Ol Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Giriş Sayfasına Yönlendirme */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

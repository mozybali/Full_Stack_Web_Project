/**
 * Footer Component
 * 
 * Uygulamanın alt bilgi bölümü.
 * 
 * İçerik:
 * - Şirket bilgileri ve açıklama
 * - Hızlı linkler
 * - Sosyal medya linkleri
 * - Telif hakkı bilgisi
 * 
 * Layout: 3 kolonlu responsive grid
 */

import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">GamerMarkt</h3>
            <p className="text-gray-400 text-sm">
              Güvenilir oyun hesapları ve key'leri için en iyi marketplace.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Ürünler</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 GamerMarkt. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

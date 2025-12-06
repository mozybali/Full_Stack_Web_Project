# GamerMarkt - Frontend

Modern bir oyun hesabı ve key marketplace frontend uygulaması. React, TypeScript, Tailwind CSS ve Vite ile geliştirilmiştir.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt olma, giriş yapma, JWT authentication
- **Ürün Katalogu**: Oyun hesapları ve key'leri listeleme ve filtreleme
- **Alışveriş Sepeti**: Ürünleri sepete ekleme, miktar güncelleme
- **Sipariş Yönetimi**: Sipariş oluşturma ve sipariş geçmişi görüntüleme
- **Admin Paneli**: Ürün, oyun, sipariş ve kullanıcı yönetimi
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu

## 🛠️ Teknolojiler

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Backend API çalışır durumda olmalı (http://localhost:3000)

## 🔧 Kurulum

1. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

2. Environment değişkenlerini ayarlayın:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Development server'ı başlatın:
\`\`\`bash
npm run dev
\`\`\`

Uygulama http://localhost:5173 adresinde çalışacaktır.

## �� Build

Production build oluşturmak için:
\`\`\`bash
npm run build
\`\`\`

## 🔐 Kullanıcı Rolleri

- **BUYER**: Ürün satın alabilir (varsayılan rol)
- **SELLER**: Ürün ekleyip yönetebilir
- **ADMIN**: Tüm yönetim işlemleri

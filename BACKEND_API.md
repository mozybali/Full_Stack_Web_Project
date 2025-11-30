# Backend API Dokumentasyonu

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Kimlik Doğrulama](#kimlik-doğrulama)
- [Kullanıcı Yönetimi](#kullanıcı-yönetimi)
- [Ürün Yönetimi](#ürün-yönetimi)
- [Sipariş Yönetimi](#sipariş-yönetimi)
- [Oyun Yönetimi](#oyun-yönetimi)
- [Rol Yönetimi](#rol-yönetimi)
- [Hata Kodları](#hata-kodları)
- [Database Şeması](#database-şeması)

## 🔐 Genel Bakış

### Base URL
```
Development: http://localhost:3000
Production: https://api.gamevault.com (örnek)
```

### Authentication
Tüm protected endpoints'ler için `Authorization` header'ı gereklidir:
```
Authorization: Bearer <JWT_TOKEN>
```

### Response Format
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "timestamp": "2025-11-30T10:30:00.000Z"
}
```

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "path": "/api/endpoint",
  "timestamp": "2025-11-30T10:30:00.000Z"
}
```

---

## 🔑 Kimlik Doğrulama (Auth)

### Register - Yeni Kullanıcı Oluştur

**Endpoint:** `POST /auth/register`

**Public:** ✅ Kimlik doğrulama gerekli değil

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "roles": ["BUYER"]
  }
}
```

**Validation Rules:**
- `email`: Geçerli email, benzersiz
- `username`: 3-20 karakter, benzersiz, alfanumerik
- `password`: Min. 8 karakter, büyük harf, küçük harf, sayı içermeli

**Error Examples:**
```json
{
  "statusCode": 400,
  "message": "Email already exists"
}
```

---

### Login - Oturum Aç

**Endpoint:** `POST /auth/login`

**Public:** ✅

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "roles": ["BUYER"]
  }
}
```

**Error Examples:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## 👥 Kullanıcı Yönetimi (Users)

### Get All Users

**Endpoint:** `GET /users`

**Protected:** 🔒 ADMIN role gerekli

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 10)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe",
      "createdAt": "2025-11-30T10:00:00.000Z",
      "updatedAt": "2025-11-30T10:00:00.000Z",
      "roles": [
        {
          "id": 1,
          "name": "BUYER"
        }
      ]
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

---

### Get User by ID

**Endpoint:** `GET /users/:id`

**Protected:** 🔒 Kendi profili veya ADMIN

**URL Parameters:**
- `id` (number): Kullanıcı ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-11-30T10:00:00.000Z",
    "updatedAt": "2025-11-30T10:00:00.000Z",
    "roles": ["BUYER"],
    "products": [],
    "orders": []
  }
}
```

---

### Delete User

**Endpoint:** `DELETE /users/:id`

**Protected:** 🔒 ADMIN role gerekli

**URL Parameters:**
- `id` (number): Silinecek kullanıcı ID

**Response (200 OK):**
```json
{
  "deleted": true
}
```

---

## 📦 Ürün Yönetimi (Products)

### Get All Products

**Endpoint:** `GET /products`

**Public:** ✅

**Query Parameters:**
```
type: "ACCOUNT" | "KEY"
gameId: number
minPrice: number
maxPrice: number
page: number (default: 1)
limit: number (default: 20)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Steam Account - AAA Games",
      "description": "100+ oyunlu hesap",
      "type": "ACCOUNT",
      "price": "2500.00",
      "currency": "TRY",
      "stock": 5,
      "isActive": true,
      "createdAt": "2025-11-30T10:00:00.000Z",
      "updatedAt": "2025-11-30T10:00:00.000Z",
      "seller": {
        "id": 2,
        "username": "seller123"
      },
      "game": {
        "id": 1,
        "name": "Steam",
        "platform": "PC"
      }
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### Get Product by ID

**Endpoint:** `GET /products/:id`

**Public:** ✅

**URL Parameters:**
- `id` (number): Ürün ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "title": "Steam Account - AAA Games",
    "description": "100+ oyunlu hesap",
    "type": "ACCOUNT",
    "price": "2500.00",
    "currency": "TRY",
    "stock": 5,
    "isActive": true,
    "createdAt": "2025-11-30T10:00:00.000Z",
    "updatedAt": "2025-11-30T10:00:00.000Z",
    "seller": {
      "id": 2,
      "username": "seller123",
      "email": "seller@example.com"
    },
    "game": {
      "id": 1,
      "name": "Steam",
      "platform": "PC",
      "genre": "Various"
    }
  }
}
```

---

### Create Product

**Endpoint:** `POST /products`

**Protected:** 🔒 SELLER veya ADMIN role gerekli

**Request Body:**
```json
{
  "title": "Steam Account - AAA Games",
  "description": "100+ oyunlu hesap",
  "type": "ACCOUNT",
  "price": 2500.00,
  "stock": 5,
  "gameId": 1
}
```

**Validation:**
- `title`: Min 3, Max 200 karakter, zorunlu
- `type`: "ACCOUNT" veya "KEY", zorunlu
- `price`: Min 0.01, zorunlu
- `stock`: Min 1, zorunlu
- `gameId`: Mevcut bir oyun ID'si, zorunlu
- `description`: Optional, Max 1000 karakter

**Response (201 Created):**
```json
{
  "data": {
    "id": 10,
    "title": "Steam Account - AAA Games",
    "type": "ACCOUNT",
    "price": "2500.00",
    "stock": 5,
    "seller": {
      "id": 2,
      "username": "seller123"
    },
    "game": {
      "id": 1,
      "name": "Steam"
    }
  }
}
```

---

### Update Product

**Endpoint:** `PATCH /products/:id`

**Protected:** 🔒 Ürün sahibi veya ADMIN

**URL Parameters:**
- `id` (number): Güncellenecek ürün ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "price": 3000.00,
  "stock": 3,
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "title": "Updated Title",
    "price": "3000.00",
    "stock": 3,
    "isActive": true
  }
}
```

---

### Delete Product

**Endpoint:** `DELETE /products/:id`

**Protected:** 🔒 Ürün sahibi veya ADMIN

**URL Parameters:**
- `id` (number): Silinecek ürün ID

**Response (200 OK):**
```json
{
  "deleted": true
}
```

---

## 🛒 Sipariş Yönetimi (Orders)

### Create Order

**Endpoint:** `POST /orders`

**Protected:** 🔒 Kullanıcı kimliği gerekli (Buyer)

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Validation:**
- `items`: Min 1 ürün, zorunlu
- `productId`: Mevcut ürün, zorunlu
- `quantity`: Min 1, zorunlu

**Response (201 Created):**
```json
{
  "data": {
    "id": 5,
    "buyer": {
      "id": 1,
      "username": "john_doe"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "title": "Steam Account"
        },
        "quantity": 2,
        "unitPrice": "2500.00"
      }
    ],
    "totalPrice": "5000.00",
    "status": "PENDING",
    "createdAt": "2025-11-30T10:00:00.000Z"
  }
}
```

**Error Examples:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for Steam Account"
}
```

---

### Get My Orders

**Endpoint:** `GET /orders/my`

**Protected:** 🔒 Kullanıcı kimliği gerekli

**Query Parameters:**
```
status: "PENDING" | "COMPLETED" | "CANCELLED"
page: number (default: 1)
limit: number (default: 10)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 5,
      "buyer": {
        "id": 1,
        "username": "john_doe"
      },
      "items": [
        {
          "id": 1,
          "product": {
            "id": 1,
            "title": "Steam Account"
          },
          "quantity": 2,
          "unitPrice": "2500.00"
        }
      ],
      "totalPrice": "5000.00",
      "status": "PENDING",
      "createdAt": "2025-11-30T10:00:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

---

### Get All Orders

**Endpoint:** `GET /orders`

**Protected:** 🔒 ADMIN role gerekli

**Query Parameters:**
```
status: "PENDING" | "COMPLETED" | "CANCELLED"
userId: number
page: number (default: 1)
limit: number (default: 20)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 5,
      "buyer": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "items": [],
      "totalPrice": "5000.00",
      "status": "PENDING",
      "createdAt": "2025-11-30T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

---

### Get Order by ID

**Endpoint:** `GET /orders/:id`

**Protected:** 🔒 Sipariş sahibi veya ADMIN

**URL Parameters:**
- `id` (number): Sipariş ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 5,
    "buyer": {
      "id": 1,
      "username": "john_doe"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "title": "Steam Account",
          "seller": {
            "id": 2,
            "username": "seller123"
          }
        },
        "quantity": 2,
        "unitPrice": "2500.00"
      }
    ],
    "totalPrice": "5000.00",
    "status": "PENDING",
    "createdAt": "2025-11-30T10:00:00.000Z"
  }
}
```

---

## 🎮 Oyun Yönetimi (Games)

### Get All Games

**Endpoint:** `GET /games`

**Public:** ✅

**Query Parameters:**
```
platform: string (filter)
page: number (default: 1)
limit: number (default: 50)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Steam",
      "platform": "PC",
      "genre": "Various",
      "products": [
        {
          "id": 1,
          "title": "Steam Account",
          "price": "2500.00"
        }
      ]
    }
  ],
  "total": 15,
  "page": 1
}
```

---

### Create Game

**Endpoint:** `POST /games`

**Protected:** 🔒 ADMIN role gerekli

**Request Body:**
```json
{
  "name": "PlayStation Network",
  "platform": "Console",
  "genre": "Various"
}
```

**Validation:**
- `name`: Min 3, Max 100 karakter, zorunlu, benzersiz
- `platform`: Min 3, Max 50 karakter, zorunlu
- `genre`: Optional, Max 100 karakter

**Response (201 Created):**
```json
{
  "data": {
    "id": 16,
    "name": "PlayStation Network",
    "platform": "Console",
    "genre": "Various"
  }
}
```

---

## 🔐 Rol Yönetimi (Roles)

### Get All Roles

**Endpoint:** `GET /roles`

**Protected:** 🔒 ADMIN role gerekli

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "BUYER",
      "description": "Ürün satın alabilen kullanıcılar"
    },
    {
      "id": 2,
      "name": "SELLER",
      "description": "Ürün satabilecek kullanıcılar"
    },
    {
      "id": 3,
      "name": "ADMIN",
      "description": "Platform yöneticileri"
    }
  ]
}
```

---

## ❌ Hata Kodları

| Kod | Anlamı | Açıklama |
|-----|--------|----------|
| **400** | Bad Request | Geçersiz input veya validation hatası |
| **401** | Unauthorized | Kimlik doğrulama başarısız veya token geçersiz |
| **403** | Forbidden | Yetkiniz yok, erişim izni reddedildi |
| **404** | Not Found | Kaynak bulunamadı |
| **409** | Conflict | Benzersiz constraint ihlali (email, username) |
| **422** | Unprocessable Entity | Request formatı yanlış |
| **500** | Internal Server Error | Sunucu hatası |
| **503** | Service Unavailable | Servis geçici olarak kullanılamıyor |

### Örnek Hata Response'ları

**401 - Invalid Token:**
```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "path": "/products",
  "timestamp": "2025-11-30T10:30:00.000Z"
}
```

**403 - Insufficient Permission:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permission. Required role: ADMIN",
  "path": "/users",
  "timestamp": "2025-11-30T10:30:00.000Z"
}
```

**409 - Already Exists:**
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "path": "/auth/register",
  "timestamp": "2025-11-30T10:30:00.000Z"
}
```

---

## 🗄️ Database Şeması

Veritabanı tasarımı, tüm tablolar, ilişkiler, constraint'ler ve örnek SQL queries için:

👉 **[DATABASE.md](./DATABASE.md)** dosyasına bakın.

---

## 📝 JWT Token Yapısı

JWT Token'ı üç bölümden oluşur:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVzIjpbIkJVWUVSIl0sImlhdCI6MTcwMzAxMDIwMCwiZXhwIjoxNzAzMDk2NjAwfQ.abc123
```

**Decoded Payload:**
```json
{
  "sub": 1,              // User ID
  "roles": ["BUYER"],    // User roles
  "iat": 1703010200,     // İssue time
  "exp": 1703096600      // Expiration time (24 saat sonra)
}
```

---

**Son Güncelleme**: 1 Aralık 2025


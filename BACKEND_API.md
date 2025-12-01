# 🔌 Backend API Dokumentasyonu

**Proje:** GameVault - Game Account & Key Marketplace  
**Framework:** NestJS 11.0  
**Son Güncelleme:** 1 Aralık 2025 (v2.0 - isActive Field, Transaction Support, Security Fixes)

---

## 📋 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Kimlik Doğrulama](#-kimlik-doğrulama)
- [Kullanıcı Yönetimi](#-kullanıcı-yönetimi)
- [Ürün Yönetimi](#-ürün-yönetimi)
- [Sipariş Yönetimi](#-sipariş-yönetimi)
- [Oyun Yönetimi](#-oyun-yönetimi)
- [Rol Yönetimi](#-rol-yönetimi)
- [Hata Kodları](#-hata-kodları)
- [Authentification](#-authentification)

---

## 🌐 Genel Bakış

### Base URL

```
Development:  http://localhost:3000
Production:   https://<api-domain>  # Kendi domain'iniz
```

### Server İnformasyonu

- **Framework:** NestJS 11.0
- **Runtime:** Node.js 18+
- **TypeScript Version:** 5.4
- **Package Manager:** npm

### Swagger API Documentation

Tüm API endpoints'leri test edebileceğiniz interaktif dokümantasyon:

📖 **Swagger UI:** Development ortamında http://localhost:3000/api adresinde

### Authentication

Tüm protected endpoints'ler için `Authorization` header'ı gereklidir:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Response Format

**Başarılı Response (2xx):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "email": "user@example.com"
  },
  "message": "Success",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**Hata Response (4xx, 5xx):**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ],
  "path": "/auth/register",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

### HTTP Methods

| Method | İşlem |
|--------|-------|
| **GET** | Veri getir |
| **POST** | Yeni veri oluştur |
| **PUT** | Tüm alanları güncelle |
| **PATCH** | Kısmi alanları güncelle |
| **DELETE** | Veri sil |

---

## 🔐 Kimlik Doğrulama (Auth)

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

**Validation Rules:**

- `email`: Geçerli email formatı, benzersiz
- `username`: 3-20 karakter, benzersiz, alfanumerik
- `password`: Min. 8 karakter, büyük harf, küçük harf, sayı, özel karakter içermeli

**Response (201 Created):**

```json
{
  "statusCode": 201,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe",
      "roles": ["BUYER"],
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Examples:**

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "path": "/auth/register",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain uppercase letter"
    }
  ]
}
```

---

### Login - Oturum Aç

**Endpoint:** `POST /auth/login`

**Public:** ✅ Kimlik doğrulama gerekli değil

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
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe",
      "roles": ["BUYER"],
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

**Error Examples:**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "path": "/auth/login"
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
search: string (email veya username'de arama)
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe",
      "createdAt": "2025-12-01T10:00:00.000Z",
      "updatedAt": "2025-12-01T10:00:00.000Z",
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
  "statusCode": 200,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z",
    "roles": [
      {
        "id": 1,
        "name": "BUYER",
        "description": "Ürün satın alabilen kullanıcılar"
      }
    ],
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
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": {
    "deleted": true,
    "id": 1
  }
}
```

---

## 🛍️ Ürün Yönetimi (Products)

### Get All Products

**Endpoint:** `GET /products`

**Public:** ✅ Kimlik doğrulama gerekli değil

**Query Parameters:**

```
type: "ACCOUNT" | "KEY"
gameId: number
sellerId: number
minPrice: number
maxPrice: number
isActive: boolean
page: number (default: 1)
limit: number (default: 20)
sort: string (createdAt, price, etc)
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
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
      "createdAt": "2025-12-01T10:00:00.000Z",
      "updatedAt": "2025-12-01T10:00:00.000Z",
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
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### Get Product by ID

**Endpoint:** `GET /products/:id`

**Public:** ✅ Kimlik doğrulama gerekli değil

**URL Parameters:**

- `id` (number): Ürün ID

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "title": "Steam Account - AAA Games",
    "description": "100+ oyunlu hesap",
    "type": "ACCOUNT",
    "price": "2500.00",
    "currency": "TRY",
    "stock": 5,
    "isActive": true,
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z",
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
  "statusCode": 201,
  "data": {
    "id": 10,
    "title": "Steam Account - AAA Games",
    "description": "100+ oyunlu hesap",
    "type": "ACCOUNT",
    "price": "2500.00",
    "stock": 5,
    "isActive": true,
    "seller": {
      "id": 2,
      "username": "seller123"
    },
    "game": {
      "id": 1,
      "name": "Steam",
      "platform": "PC"
    },
    "createdAt": "2025-12-01T10:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

---

### Update Product

**Endpoint:** `PUT /products/:id`

**Protected:** 🔒 Ürün sahibi veya ADMIN

**URL Parameters:**

- `id` (number): Güncellenecek ürün ID

**Request Body (Tüm alanlar opsiyonel):**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 3000.00,
  "stock": 10,
  "isActive": false,
  "gameId": 2
}
```

**Validation:**

- `title`: Min 3, Max 200 karakter (opsiyonel)
- `price`: Min 0, opsiyonel
- `stock`: Min 1, opsiyonel
- `isActive`: Boolean, opsiyonel (ürün deaktif etmek için kullanın)
- `gameId`: Mevcut oyun ID'si, opsiyonel
- `description`: Max 1000 karakter, opsiyonel

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated description",
    "price": "3000.00",
    "stock": 10,
    "isActive": false,
    "type": "ACCOUNT",
    "seller": {
      "id": 2,
      "username": "seller123"
    },
    "game": {
      "id": 2,
      "name": "Epic Games"
    },
    "updatedAt": "2025-12-01T11:30:00.000Z"
  },
  "message": "Product updated successfully"
}
```

**Hata Örnekleri:**

```json
{
  "statusCode": 403,
  "message": "Sadece ürün sahibi bu ürünü güncelleyebilir",
  "path": "/products/1",
  "timestamp": "2025-12-01T11:30:00.000Z"
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
  "statusCode": 200,
  "message": "Product deleted successfully",
  "data": {
    "deleted": true,
    "id": 1
  }
}
```

---

## 📦 Sipariş Yönetimi (Orders)

### Create Order

**Endpoint:** `POST /orders`

**Protected:** 🔒 Kullanıcı kimliği gerekli (BUYER)

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
- `productId`: Mevcut ve aktif ürün, zorunlu
- `quantity`: Min 1, Max stok, zorunlu

**⚠️ Önemli - Transaction Desteği:**

Sipariş oluşturma işlemi **database transaction** içinde gerçekleşir:
- ✓ Tüm ürün kontrolleri yapılır
- ✓ Stok yeterliliği kontrol edilir
- ✓ Sipariş ve stok güncelleme atomik işlemdir
- ✓ Hata durumunda tüm değişiklikler geri alınır (rollback)
- ✓ Concurrent siparişlerde stok uyumsuzluğu engellenir

**Response (201 Created):**

```json
{
  "statusCode": 201,
  "data": {
    "id": 5,
    "buyer": {
      "id": 1,
      "username": "john_doe",
      "email": "user@example.com"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "title": "Steam Account",
          "type": "ACCOUNT"
        },
        "quantity": 2,
        "unitPrice": "2500.00"
      }
    ],
    "totalPrice": "5000.00",
    "status": "PENDING",
    "createdAt": "2025-12-01T10:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

**Error Examples:**

```json
{
  "statusCode": 400,
  "message": "Insufficient stock for product: Steam Account"
}
```

---

### Get My Orders

**Endpoint:** `GET /orders/my`

**Protected:** 🔒 Kullanıcı kimliği gerekli

**Query Parameters:**

```
status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED"
page: number (default: 1)
limit: number (default: 10)
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
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
            "title": "Steam Account",
            "type": "ACCOUNT"
          },
          "quantity": 2,
          "unitPrice": "2500.00"
        }
      ],
      "totalPrice": "5000.00",
      "status": "PENDING",
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

---

### Get All Orders (Admin)

**Endpoint:** `GET /orders`

**Protected:** 🔒 ADMIN role gerekli

**Query Parameters:**

```
status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED"
buyerId: number
page: number (default: 1)
limit: number (default: 20)
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
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
      "createdAt": "2025-12-01T10:00:00.000Z"
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
  "statusCode": 200,
  "data": {
    "id": 5,
    "buyer": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "title": "Steam Account",
          "type": "ACCOUNT",
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
    "createdAt": "2025-12-01T10:00:00.000Z"
  }
}
```

---

## 🎮 Oyun Yönetimi (Games)

### Get All Games

**Endpoint:** `GET /games`

**Public:** ✅ Kimlik doğrulama gerekli değil

**Query Parameters:**

```
platform: string (filter)
search: string (name'de arama)
page: number (default: 1)
limit: number (default: 50)
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
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
          "price": "2500.00",
          "type": "ACCOUNT"
        }
      ]
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 50
}
```

---

### Get Game by ID

**Endpoint:** `GET /games/:id`

**Public:** ✅ Kimlik doğrulama gerekli değil

**URL Parameters:**

- `id` (number): Oyun ID

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Steam",
    "platform": "PC",
    "genre": "Various",
    "products": [
      {
        "id": 1,
        "title": "Steam Account",
        "price": "2500.00",
        "type": "ACCOUNT",
        "seller": {
          "id": 2,
          "username": "seller123"
        }
      }
    ]
  }
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
  "statusCode": 201,
  "data": {
    "id": 16,
    "name": "PlayStation Network",
    "platform": "Console",
    "genre": "Various"
  },
  "message": "Game created successfully"
}
```

---

### Update Game

**Endpoint:** `PATCH /games/:id`

**Protected:** 🔒 ADMIN role gerekli

**URL Parameters:**

- `id` (number): Güncellenecek oyun ID

**Request Body:**

```json
{
  "name": "PlayStation 5 Network",
  "genre": "Various Games"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 16,
    "name": "PlayStation 5 Network",
    "platform": "Console",
    "genre": "Various Games"
  },
  "message": "Game updated successfully"
}
```

---

### Delete Game

**Endpoint:** `DELETE /games/:id`

**Protected:** 🔒 ADMIN role gerekli

**URL Parameters:**

- `id` (number): Silinecek oyun ID

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Game deleted successfully",
  "data": {
    "deleted": true,
    "id": 16
  }
}
```

---

## 🔑 Rol Yönetimi (Roles)

### Get All Roles

**Endpoint:** `GET /roles`

**Protected:** 🔒 ADMIN role gerekli

**Response (200 OK):**

```json
{
  "statusCode": 200,
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
  ],
  "total": 3
}
```

---

### Create Role

**Endpoint:** `POST /roles`

**Protected:** 🔒 ADMIN role gerekli

**Request Body:**

```json
{
  "name": "MODERATOR",
  "description": "İçerik moderatörü"
}
```

**Response (201 Created):**

```json
{
  "statusCode": 201,
  "data": {
    "id": 4,
    "name": "MODERATOR",
    "description": "İçerik moderatörü"
  },
  "message": "Role created successfully"
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

**400 - Validation Error:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "path": "/auth/register",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**401 - Invalid Token:**

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "path": "/products",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**403 - Insufficient Permission:**

```json
{
  "statusCode": 403,
  "message": "Insufficient permission. Required role: ADMIN",
  "path": "/users",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**404 - Not Found:**

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "path": "/products/999",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**409 - Already Exists:**

```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "path": "/auth/register",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

---

## 🔐 Authentification

### JWT Token Yapısı

JWT Token'ı üç bölümden oluşur:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVzIjpbIkJVWUVSIl0sImlhdCI6MTcwMzAxMDIwMCwiZXhwIjoxNzAzMDk2NjAwfQ.abc123def456
```

**Decoded Payload:**

```json
{
  "sub": 1,              // User ID
  "roles": ["BUYER"],    // User roles array
  "iat": 1703010200,     // İssue time (Issued At)
  "exp": 1703096600      // Expiration time (24 saat sonra)
}
```

### Token Bilgileri

| Özellik | Değer |
|---------|-------|
| **Algorithm** | HS256 (HMAC with SHA-256) |
| **Expiration** | 1 gün (çıkış yapıldığında geçersiz) |
| **Header** | Authorization: Bearer [token] |

### Token Refresh

Geçerli token süresi dolduğunda, yeni bir token için login işlemini tekrarlamanız gerekir.

---

### Roller ve Permissions

| Rol | İzinler |
|-----|---------|
| **BUYER** | ✓ Ürün görüntüleme<br>✓ Sipariş oluşturma<br>✓ Kendi siparişlerini görüntüleme<br>✗ Ürün yönetimi |
| **SELLER** | ✓ Ürün yönetimi (CRUD)<br>✓ Ürün status yönetimi (isActive)<br>✓ Kendi ürünlerinin satışlarını görüntüleme<br>✓ BUYER izinleri |
| **ADMIN** | ✓ Tüm işlemleri yapabilir<br>✓ Kullanıcı yönetimi<br>✓ Oyun/Rol yönetimi<br>✓ Sistem yapılandırması<br>✓ Tüm siparişleri görüntüleme |

---

## 🔒 Güvenlik Best Practices

### Implementasyonda Kullanılan Güvenlik Özellikleri

1. **JWT Authentication**
   - Token-based, stateless authentication
   - Secure token signing with HS256
   - Token expiration desteği

2. **Role-Based Access Control (RBAC)**
   - Üç ana rol: BUYER, SELLER, ADMIN
   - Endpoint-level role validation
   - Resource ownership validation

3. **Input Validation**
   - Class-validator ile otomatik validasyon
   - Email, URL, numeric range kontrolleri
   - SQL injection prevention (TypeORM ORM kullanımı)

4. **Database Security**
   - Transactions ile atomik işlemler
   - Concurrent request handling (stok yönetimi)
   - Password hashing (bcrypt - salt: 10)

5. **CORS Configuration**
   - Frontend URL validation
   - Credentials support

### Production Güvenliği için Öneriler

⚠️ **CRITICAL:**
- JWT_SECRET'ı minimum 32 karakterli, karmaşık bir değer yapın
- Database şifresini güvenli ve unique olarak ayarlayın
- NODE_ENV'i production'da `production` yapın

**IMPORTANT:**
- API rate limiting ekleyin (DDoS protection)
- HTTPS kullanın (TLS/SSL)
- Request logging ve monitoring ekleyin
- Regular security audits yapın
- Dependency updates'i takip edin

---

## 📚 Kaynaklar

### Proje Dökümentasyonu

- 📖 [README.md](./README.md) - Proje genel bilgileri
- 🗄️ [DATABASE.md](./DATABASE.md) - Veritabanı şeması ve ilişkileri

### Resmi Dokümantasyonlar

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT Official](https://jwt.io/)

---

**Son Güncelleme:** 1 Aralık 2025  
**Proje:** [Full_Stack_Web_Project](https://github.com/mozybali/Full_Stack_Web_Project)

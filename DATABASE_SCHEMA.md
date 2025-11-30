# Database Schema Dokumentasyonu

## 📋 İçindekiler

- [Veritabanı Genel Bilgiler](#veritabanı-genel-bilgiler)
- [Tablolar](#tablolar)
- [İlişkiler](#ilişkiler)
- [Enums](#enums)
- [İndeksler](#indeksler)
- [Constraints](#constraints)

---

## 🗄️ Veritabanı Genel Bilgiler

| Property | Değer |
|----------|-------|
| **DBMS** | PostgreSQL 12+ |
| **ORM** | TypeORM |
| **Synchronize** | true (development) |
| **Charset** | UTF-8 |
| **Timezone** | UTC |

### Connection String

```
postgresql://username:password@localhost:5432/gamevault
```

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gamevault
```

---

## 📊 Tablolar

### 1. users (Kullanıcılar)

Sistemdeki tüm kullanıcıları depolamak için ana tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz kullanıcı ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Kullanıcı email adresi |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Kullanıcı adı |
| `passwordHash` | VARCHAR(255) | NOT NULL | Şifrelenmiş şifre (bcrypt) |
| `createdAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Oluşturulma tarihi |
| `updatedAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Güncellenme tarihi |

**İndeksler:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_createdAt ON users(createdAt);
```

**Örnek Query:**
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

---

### 2. roles (Roller)

Sistem rolleri ve izinleri tanımlamak için tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz rol ID |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Rol adı (BUYER, SELLER, ADMIN) |
| `description` | VARCHAR(255) | Nullable | Rol açıklaması |

**Varsayılan Roller:**
```sql
INSERT INTO roles (name, description) VALUES
  ('BUYER', 'Ürün satın alabilen kullanıcılar'),
  ('SELLER', 'Ürün satabilecek kullanıcılar'),
  ('ADMIN', 'Platform yöneticileri');
```

---

### 3. user_roles (Kullanıcı-Rol İlişkisi)

Kullanıcılar ile roller arasındaki many-to-many ilişkisini tanımlamak için junction table.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `userId` | INTEGER | FK (users.id), PK | Kullanıcı ID |
| `roleId` | INTEGER | FK (roles.id), PK | Rol ID |

**Foreign Keys:**
```sql
ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_userId 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_roleId 
FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE;
```

**Örnek Query:**
```sql
-- Kullanıcının rollerini getir
SELECT r.* FROM roles r
JOIN user_roles ur ON r.id = ur.roleId
WHERE ur.userId = 1;
```

---

### 4. games (Oyunlar)

Satılan oyunların katalogunu tutmak için tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz oyun ID |
| `name` | VARCHAR(150) | UNIQUE, NOT NULL | Oyun adı |
| `platform` | VARCHAR(50) | NOT NULL | Platform (PC, Console, Mobile) |
| `genre` | VARCHAR(100) | Nullable | Oyun türü (Action, RPG, etc) |

**İndeksler:**
```sql
CREATE INDEX idx_games_name ON games(name);
CREATE INDEX idx_games_platform ON games(platform);
```

**Örnek Data:**
```sql
INSERT INTO games (name, platform, genre) VALUES
  ('Steam', 'PC', 'Various'),
  ('PlayStation Network', 'Console', 'Various'),
  ('Xbox Live', 'Console', 'Various'),
  ('Epic Games', 'PC', 'Various');
```

---

### 5. products (Ürünler)

Satılan ürünleri (hesaplar ve anahtarlar) tutmak için ana tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz ürün ID |
| `title` | VARCHAR(200) | NOT NULL | Ürün başlığı |
| `description` | TEXT | Nullable | Ürün açıklaması |
| `type` | ENUM | NOT NULL | Ürün tipi (ACCOUNT, KEY) |
| `price` | DECIMAL(10,2) | NOT NULL | Fiyat |
| `currency` | VARCHAR(3) | DEFAULT 'TRY' | Para birimi |
| `stock` | INTEGER | DEFAULT 1 | Stok miktarı |
| `isActive` | BOOLEAN | DEFAULT true | Ürün aktif mi |
| `sellerId` | INTEGER | FK (users.id), NOT NULL | Satıcı ID |
| `gameId` | INTEGER | FK (games.id), NOT NULL | İlgili oyun ID |
| `createdAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Oluşturulma tarihi |
| `updatedAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Güncellenme tarihi |

**Enum Values:**
```typescript
enum ProductType {
  ACCOUNT = 'ACCOUNT',  // Oyun hesabı
  KEY = 'KEY'           // Oyun anahtarı
}
```

**İndeksler:**
```sql
CREATE INDEX idx_products_sellerId ON products(sellerId);
CREATE INDEX idx_products_gameId ON products(gameId);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_isActive ON products(isActive);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_createdAt ON products(createdAt DESC);
```

**Foreign Keys:**
```sql
ALTER TABLE products 
ADD CONSTRAINT fk_products_sellerId 
FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT fk_products_gameId 
FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE RESTRICT;
```

**Örnek Query:**
```sql
-- Aktif ürünleri, satıcı ve oyun bilgisiyle getir
SELECT p.*, u.username as seller_name, g.name as game_name
FROM products p
JOIN users u ON p.sellerId = u.id
JOIN games g ON p.gameId = g.id
WHERE p.isActive = true AND p.stock > 0
ORDER BY p.createdAt DESC;
```

---

### 6. orders (Siparişler)

Müşterilerin siparişlerini tutmak için ana tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz sipariş ID |
| `buyerId` | INTEGER | FK (users.id), NOT NULL | Alıcı ID |
| `status` | ENUM | DEFAULT 'PENDING' | Sipariş durumu |
| `totalPrice` | DECIMAL(10,2) | NOT NULL | Toplam fiyat |
| `createdAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Sipariş tarihi |

**Enum Values:**
```typescript
enum OrderStatus {
  PENDING = 'PENDING',       // Bekleniyor
  COMPLETED = 'COMPLETED',   // Tamamlandı
  CANCELLED = 'CANCELLED'    // İptal edildi
}
```

**İndeksler:**
```sql
CREATE INDEX idx_orders_buyerId ON orders(buyerId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_createdAt ON orders(createdAt DESC);
```

**Foreign Keys:**
```sql
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_buyerId 
FOREIGN KEY (buyerId) REFERENCES users(id) ON DELETE CASCADE;
```

---

### 7. order_items (Sipariş Satırları)

Siparişlerdeki ürünleri tutmak için junction table.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz satır ID |
| `orderId` | INTEGER | FK (orders.id), NOT NULL | Sipariş ID |
| `productId` | INTEGER | FK (products.id), NOT NULL | Ürün ID |
| `quantity` | INTEGER | NOT NULL, CHECK > 0 | Ürün miktarı |
| `unitPrice` | DECIMAL(10,2) | NOT NULL | Satın alındığı andaki fiyat |

**Foreign Keys:**
```sql
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_orderId 
FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_productId 
FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT;
```

**İndeksler:**
```sql
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_productId ON order_items(productId);
```

---

## 🔗 İlişkiler (Relationships)

### Entity Relationship Diagram

```
┌─────────────┐
│   users     │
│  ─────────  │
│  id (PK)    │
│  email      │◄──────┐
│  username   │       │
│  password   │       │
│  createdAt  │       │ 1
│  updatedAt  │       │
└─────────────┘       │
      │       ▲       │
      │       │       │
   1:N   (Many)   (Many)
      │       │       │
      │   ┌───────────┴────┐
      │   │                │
      │   ▼                ▼
      │  user_roles    ┌─────────────┐
      │                │   roles     │
      │                │  ─────────  │
      │                │  id (PK)    │
      │                │  name       │
      │                │  description│
      │                └─────────────┘
      │
      │
   1:N (Many)
      │
      ├─── sellers (1:N in products)
      │
      └─── buyers (1:N in orders)
```

### Relationships Açıklaması

#### 1. Users ↔ Roles (Many-to-Many)

```typescript
// User Entity
@ManyToMany(() => Role, (role) => role.users, { eager: true })
@JoinTable({
  name: 'user_roles',
  joinColumn: { name: 'user_id' },
  inverseJoinColumn: { name: 'role_id' },
})
roles: Role[];

// Role Entity
@ManyToMany(() => User, (user) => user.roles)
users: User[];
```

**Kullanım:**
```javascript
// Kullanıcı rolleri
const user = await userRepository.findOne({ where: { id: 1 } });
console.log(user.roles); // [{ id: 1, name: 'BUYER' }]
```

---

#### 2. Users → Products (One-to-Many)

```typescript
// User Entity
@OneToMany(() => Product, (product) => product.seller)
products: Product[];

// Product Entity
@ManyToOne(() => User, (user) => user.products, { eager: true })
seller: User;
```

**Kullanım:**
```javascript
// Satıcının ürünlerini getir
const products = await productRepository.find({
  where: { seller: { id: userId } },
  relations: ['game']
});
```

---

#### 3. Users → Orders (One-to-Many)

```typescript
// User Entity
@OneToMany(() => Order, (order) => order.buyer)
orders: Order[];

// Order Entity
@ManyToOne(() => User, (user) => user.orders, { eager: true })
buyer: User;
```

---

#### 4. Games → Products (One-to-Many)

```typescript
// Game Entity
@OneToMany(() => Product, (product) => product.game)
products: Product[];

// Product Entity
@ManyToOne(() => Game, (game) => game.products, { eager: true })
game: Game;
```

---

#### 5. Orders ↔ OrderItems ↔ Products (Complex)

```typescript
// Order Entity
@OneToMany(() => OrderItem, (item) => item.order, {
  cascade: true,
  eager: true
})
items: OrderItem[];

// OrderItem Entity
@ManyToOne(() => Order, (order) => order.items)
order: Order;

@ManyToOne(() => Product)
product: Product;

// Product Entity - Products'ın OrderItem'larla ilişkisi
(Implicit - Product silme işleminde OrderItem'lar etkilenmez)
```

---

## 📚 Enums

### ProductType

```typescript
enum ProductType {
  ACCOUNT = 'ACCOUNT',  // Oyun hesabı (email + şifre)
  KEY = 'KEY'           // Aktivasyon anahtarı
}
```

**Veritabanında:**
```sql
ALTER TABLE products 
ADD CONSTRAINT check_product_type 
CHECK (type IN ('ACCOUNT', 'KEY'));
```

---

### OrderStatus

```typescript
enum OrderStatus {
  PENDING = 'PENDING',       // Sipariş alındı, işleme alındı
  COMPLETED = 'COMPLETED',   // Ürünler teslim edildi
  CANCELLED = 'CANCELLED'    // Sipariş iptal edildi
}
```

**Veritabanında:**
```sql
ALTER TABLE orders 
ADD CONSTRAINT check_order_status 
CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'));
```

---

## 🔑 Constraints

### Primary Keys
```sql
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE roles ADD PRIMARY KEY (id);
ALTER TABLE games ADD PRIMARY KEY (id);
ALTER TABLE products ADD PRIMARY KEY (id);
ALTER TABLE orders ADD PRIMARY KEY (id);
ALTER TABLE order_items ADD PRIMARY KEY (id);
ALTER TABLE user_roles ADD PRIMARY KEY (user_id, role_id);
```

### Unique Constraints
```sql
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT uq_users_username UNIQUE (username);
ALTER TABLE roles ADD CONSTRAINT uq_roles_name UNIQUE (name);
ALTER TABLE games ADD CONSTRAINT uq_games_name UNIQUE (name);
```

### Check Constraints
```sql
ALTER TABLE products 
ADD CONSTRAINT check_price_positive CHECK (price > 0);

ALTER TABLE products 
ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);

ALTER TABLE order_items 
ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);

ALTER TABLE order_items 
ADD CONSTRAINT check_unit_price_positive CHECK (unitPrice > 0);
```

### Foreign Key Constraints
```sql
-- Cascade Delete
ALTER TABLE products 
ADD CONSTRAINT fk_products_seller 
FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE;

-- Restrict Delete (varsayılan)
ALTER TABLE products 
ADD CONSTRAINT fk_products_game 
FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE RESTRICT;

-- Cascade Delete
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_buyer 
FOREIGN KEY (buyerId) REFERENCES users(id) ON DELETE CASCADE;

-- Cascade Delete
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_order 
FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE;
```

---

## 📈 Örnek Queries

### Kompleks Query Örnekleri

**1. Kullanıcının Satın Aldığı Tüm Ürünleri Listele**
```sql
SELECT DISTINCT
  p.id,
  p.title,
  p.type,
  p.price,
  g.name as game_name,
  u.username as seller_name,
  oi.quantity,
  o.status,
  o.createdAt as order_date
FROM order_items oi
JOIN products p ON oi.productId = p.id
JOIN games g ON p.gameId = g.id
JOIN users u ON p.sellerId = u.id
JOIN orders o ON oi.orderId = o.id
WHERE o.buyerId = 1
ORDER BY o.createdAt DESC;
```

**2. Satıcının Satış İstatistikleri**
```sql
SELECT
  u.id,
  u.username,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT o.id) as total_sales,
  SUM(oi.quantity * oi.unitPrice) as total_revenue,
  AVG(oi.unitPrice) as avg_price
FROM users u
LEFT JOIN products p ON u.id = p.sellerId
LEFT JOIN order_items oi ON p.id = oi.productId
LEFT JOIN orders o ON oi.orderId = o.id
WHERE u.id IN (
  SELECT DISTINCT userId FROM user_roles WHERE roleId = 2
)
GROUP BY u.id, u.username
ORDER BY total_revenue DESC;
```

**3. En Popüler Oyunlar**
```sql
SELECT
  g.id,
  g.name,
  g.platform,
  COUNT(DISTINCT p.id) as product_count,
  SUM(oi.quantity) as total_sold,
  AVG(p.price) as avg_price
FROM games g
LEFT JOIN products p ON g.id = p.gameId
LEFT JOIN order_items oi ON p.id = oi.productId
GROUP BY g.id, g.name, g.platform
ORDER BY total_sold DESC
LIMIT 10;
```

---

## 🔄 Migration İşlemleri

### Tablo Oluşturma (Automatic - TypeORM)

TypeORM `synchronize: true` ayarı ile tablolar otomatik oluşturulur.

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gamevault',
  autoLoadEntities: true,
  synchronize: true,  // Development only!
})
```

---

**Son Güncelleme**: 30 Kasım 2025


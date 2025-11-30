# 🗄️ Database Dokümantasyonu

## 📋 İçindekiler

- [Genel Bilgiler](#-genel-bilgiler)
- [Veritabanı Kurulumu](#-veritabanı-kurulumu)
- [Entity Diyagramı](#-entity-diyagramı)
- [Tablolar](#-tablolar)
- [İlişkiler](#-ilişkiler)
- [Enum Tipleri](#-enum-tipleri)
- [İndeksler](#-indeksler)
- [Constraints](#-constraints)
- [Örnek Queries](#-örnek-queries)
- [Başvuru](#-başvuru)

---

## 🔧 Genel Bilgiler

| Property | Değer |
|----------|-------|
| **DBMS** | PostgreSQL 12+ |
| **ORM** | TypeORM |
| **Synchronize** | true (development) |
| **Charset** | UTF-8 |
| **Timezone** | UTC |

### Bağlantı Bilgisi

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gamevault
```

---

## 💾 Veritabanı Kurulumu

### 1️⃣ PostgreSQL Kurulumu (İlk Kez)

```bash
# macOS (Homebrew)
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# https://www.postgresql.org/download/windows/ adresinden indir
```

### 2️⃣ PostgreSQL Başlatma

```bash
# macOS
brew services start postgresql@15

# Ubuntu/Debian
sudo systemctl start postgresql

# Kontrol et
psql --version
```

### 3️⃣ Database Oluşturma

```bash
# PostgreSQL shell'e bağlan
psql -U postgres

# Database oluştur
CREATE DATABASE gamevault;

# Veritabanını listele
\l

# Çık
\q
```

### 4️⃣ Uygulama Başlatma

Uygulama başlatıldığında TypeORM otomatik olarak:
- Database'e bağlanır
- Tüm tabloları oluşturur (eğer yoksa)
- Tabloları senkronize eder

```bash
cd backend
npm install
npm run start:dev
```

**✅ Başarılı oldu!** Veritabanı hazır ve uygulamaya başlamaya hazır.

---

## 📊 Entity Diyagramı

```
┌──────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                        │
└──────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   games     │
                              │  ─────────  │
                              │  id (PK)    │
                              │  name       │
                              │  platform   │
                              │  genre      │
                              └────────┬────┘
                                       │ 1:N
                                       │
┌──────────────────┐            ┌──────▼─────────┐
│     users        │            │    products    │
│   ──────────     │            │   ──────────   │
│   id (PK) ◄──────┼────┐       │   id (PK)      │
│   email   │      │    │       │   title        │
│ username  │      │    │       │   description │
│ password  │      │    └───────┤   seller_id(FK)
│ createdAt │      │ 1:N        │   game_id (FK) │
│ updatedAt │      │            │   type (ENUM)  │
└─────┬────┘      │            │   price        │
      │ M:N       │            │   stock        │
      │           │            │   isActive     │
  ┌───▼────┐      │            │   createdAt    │
  │user_    │      │            │   updatedAt    │
  │roles    │      │            └──────┬────────┘
  └───┬────┘      │                    │ M:1
      │ M:N       │                    │
      │           │        ┌───────────┘
      │     ┌─────▼────┐   │
      └────►│  roles   │   │
            │──────────│   │
            │ id (PK)  │   │
            │ name     │   │
            │ desc.    │   │
            └──────────┘   │
                           │
                    ┌──────▼─────────┐
                    │    orders      │
                    │   ──────────   │
                    │   id (PK)      │
                    │   buyer_id (FK)
                    │   status (ENUM)
                    │   totalPrice   │
                    │   createdAt    │
                    └──────┬─────────┘
                           │ 1:N
                           │
                    ┌──────▼──────────┐
                    │  order_items    │
                    │  ──────────────┐
                    │  id (PK)       │
                    │  order_id (FK) │
                    │  product_id(FK)
                    │  quantity      │
                    │  unitPrice     │
                    └────────────────┘
```

---

## 📋 Tablolar

### 1️⃣ users (Kullanıcılar)

**Tanım:** Sistemdeki tüm kullanıcıları depolamak için ana tablo.

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
```

**Örnek Veri:**
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

---

### 2️⃣ roles (Roller)

**Tanım:** Sistem rolleri ve izinleri tanımlamak için tablo.

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

### 3️⃣ user_roles (Kullanıcı-Rol İlişkisi)

**Tanım:** Kullanıcılar ile roller arasındaki many-to-many ilişkisini tanımlamak için junction table.

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

---

### 4️⃣ games (Oyunlar)

**Tanım:** Satılan oyunların katalogunu tutmak için tablo.

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

---

### 5️⃣ products (Ürünler)

**Tanım:** Satılan ürünleri (hesaplar ve anahtarlar) tutmak için ana tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz ürün ID |
| `title` | VARCHAR(200) | NOT NULL | Ürün başlığı |
| `description` | TEXT | Nullable | Ürün açıklaması |
| `type` | ENUM | NOT NULL | Ürün tipi (ACCOUNT, KEY) |
| `price` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Fiyat |
| `currency` | VARCHAR(3) | DEFAULT 'TRY' | Para birimi |
| `stock` | INTEGER | DEFAULT 1, CHECK >= 0 | Stok miktarı |
| `isActive` | BOOLEAN | DEFAULT true | Ürün aktif mi |
| `sellerId` | INTEGER | FK (users.id), NOT NULL | Satıcı ID |
| `gameId` | INTEGER | FK (games.id), NOT NULL | İlgili oyun ID |
| `createdAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Oluşturulma tarihi |
| `updatedAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Güncellenme tarihi |

**İndeksler:**
```sql
CREATE INDEX idx_products_sellerId ON products(sellerId);
CREATE INDEX idx_products_gameId ON products(gameId);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_isActive ON products(isActive);
CREATE INDEX idx_products_createdAt ON products(createdAt DESC);
```

---

### 6️⃣ orders (Siparişler)

**Tanım:** Müşterilerin siparişlerini tutmak için ana tablo.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz sipariş ID |
| `buyerId` | INTEGER | FK (users.id), NOT NULL | Alıcı ID |
| `status` | ENUM | DEFAULT 'PENDING' | Sipariş durumu |
| `totalPrice` | DECIMAL(10,2) | NOT NULL | Toplam fiyat |
| `createdAt` | TIMESTAMP | DEFAULT NOW(), NOT NULL | Sipariş tarihi |

**İndeksler:**
```sql
CREATE INDEX idx_orders_buyerId ON orders(buyerId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_createdAt ON orders(createdAt DESC);
```

---

### 7️⃣ order_items (Sipariş Satırları)

**Tanım:** Siparişlerdeki ürünleri tutmak için junction table.

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK, AUTO_INCREMENT | Benzersiz satır ID |
| `orderId` | INTEGER | FK (orders.id), NOT NULL | Sipariş ID |
| `productId` | INTEGER | FK (products.id), NOT NULL | Ürün ID |
| `quantity` | INTEGER | NOT NULL, CHECK > 0 | Ürün miktarı |
| `unitPrice` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Satın alındığı andaki fiyat |

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

## 🔗 İlişkiler

### Users ↔ Roles (Many-to-Many)

```typescript
// User Entity
@ManyToMany(() => Role, (role) => role.users, { eager: true })
@JoinTable({
  name: 'user_roles',
  joinColumn: { name: 'userId' },
  inverseJoinColumn: { name: 'roleId' },
})
roles: Role[];

// Role Entity
@ManyToMany(() => User, (user) => user.roles)
users: User[];
```

**Kullanım:**
```javascript
const user = await userRepository.findOne({ where: { id: 1 } });
console.log(user.roles); // [{ id: 1, name: 'BUYER' }]
```

---

### Users → Products (One-to-Many) - Satıcı

```typescript
// User Entity
@OneToMany(() => Product, (product) => product.seller)
products: Product[];

// Product Entity
@ManyToOne(() => User, (user) => user.products, { eager: true })
@JoinColumn({ name: 'sellerId' })
seller: User;
```

---

### Users → Orders (One-to-Many) - Alıcı

```typescript
// User Entity
@OneToMany(() => Order, (order) => order.buyer)
orders: Order[];

// Order Entity
@ManyToOne(() => User, (user) => user.orders, { eager: true })
@JoinColumn({ name: 'buyerId' })
buyer: User;
```

---

### Games → Products (One-to-Many)

```typescript
// Game Entity
@OneToMany(() => Product, (product) => product.game)
products: Product[];

// Product Entity
@ManyToOne(() => Game, (game) => game.products, { eager: true })
@JoinColumn({ name: 'gameId' })
game: Game;
```

---

### Orders ↔ OrderItems ↔ Products (Complex)

```typescript
// Order Entity
@OneToMany(() => OrderItem, (item) => item.order, {
  cascade: true,
  eager: true
})
items: OrderItem[];

// OrderItem Entity
@ManyToOne(() => Order, (order) => order.items)
@JoinColumn({ name: 'orderId' })
order: Order;

@ManyToOne(() => Product)
@JoinColumn({ name: 'productId' })
product: Product;
```

---

## 📌 Enum Tipleri

### ProductType

```typescript
enum ProductType {
  ACCOUNT = 'ACCOUNT',  // Oyun hesabı (email + şifre)
  KEY = 'KEY'           // Aktivasyon anahtarı
}
```

**SQL Check Constraint:**
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

**SQL Check Constraint:**
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
ALTER TABLE user_roles ADD PRIMARY KEY (userId, roleId);
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
-- Users - Products (CASCADE DELETE)
ALTER TABLE products 
ADD CONSTRAINT fk_products_seller 
FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE;

-- Games - Products (RESTRICT DELETE)
ALTER TABLE products 
ADD CONSTRAINT fk_products_game 
FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE RESTRICT;

-- Users - Orders (CASCADE DELETE)
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_buyer 
FOREIGN KEY (buyerId) REFERENCES users(id) ON DELETE CASCADE;

-- Orders - OrderItems (CASCADE DELETE)
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_order 
FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE;

-- Products - OrderItems (RESTRICT DELETE)
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_product 
FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT;
```

---

## 📊 Örnek Queries

### 1. Kullanıcının Satın Aldığı Tüm Ürünleri Listele

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

### 2. Satıcının Satış İstatistikleri

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

### 3. En Popüler Oyunlar

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

### 4. Stok Uyarısı - 5'ten Az Stok

```sql
SELECT
  id,
  title,
  type,
  stock,
  price,
  (
    SELECT name FROM games WHERE id = products.gameId
  ) as game_name
FROM products
WHERE stock < 5 AND isActive = true
ORDER BY stock ASC;
```

### 5. Aylık Satış Trendi

```sql
SELECT
  DATE_TRUNC('month', o.createdAt) as month,
  COUNT(o.id) as total_orders,
  SUM(o.totalPrice) as total_revenue,
  COUNT(DISTINCT o.buyerId) as unique_buyers
FROM orders o
WHERE o.status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', o.createdAt)
ORDER BY month DESC;
```

---

## 🔍 Başvuru

### TypeORM Configuration

```typescript
// app.module.ts
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'gamevault',
    autoLoadEntities: true,
    synchronize: true,  // Development only!
    logging: false,
  }),
})
```

### Entity Dekoratörleri

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];
}
```

### Veritabanı Yedekleme

```bash
# Backup al
pg_dump -U postgres gamevault > backup.sql

# Restore et
psql -U postgres gamevault < backup.sql
```

---

**Son Güncelleme:** 1 Aralık 2025

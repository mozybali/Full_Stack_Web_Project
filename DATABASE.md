# 🗄️ Database Dokümantasyonu

**Proje:** GameVault - Game Account & Key Marketplace  
**Veritabanı:** PostgreSQL 12+  
**ORM:** TypeORM 0.3.20  
**Son Güncelleme:** 1 Aralık 2025 (v2.0 - Transaction Support, isActive Field, Security Enhancements)

---

## 📋 İçindekiler

- [Genel Bilgiler](#-genel-bilgiler)
- [Veritabanı Kurulumu](#-veritabanı-kurulumu)
- [Entity Diyagramı](#-entity-diyagramı)
- [Tablolar](#-tablolar)
- [İlişkiler](#-ilişkiler)
- [Enum Tipleri](#-enum-tipleri)
- [Constraints](#-constraints)
- [Örnek Queries](#-örnek-queries)
- [Veritabanı Yedekleme](#-veritabanı-yedekleme)

---

## 🔧 Genel Bilgiler

| Özellik | Değer |
|---------|-------|
| **DBMS** | PostgreSQL 12+ |
| **ORM** | TypeORM 0.3.20 |
| **Synchronize** | true (development), false (production) |
| **Charset** | UTF-8 |
| **Timezone** | UTC |
| **Tablo Sayısı** | 7 Ana + 1 Junction |
| **İlişki Tipi** | One-to-Many, Many-to-Many |

### Bağlantı Bilgisi

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=<veritabanı-kullanıcısı>
DB_PASSWORD=<veritabanı-şifresi>
DB_NAME=gamevault
DB_LOGGING=false
DB_SYNCHRONIZE=true  # Development: true, Production: false
```

---

## 💾 Veritabanı Kurulumu

### 1️⃣ PostgreSQL Kurulumu (İlk Kez)

PostgreSQL resmi website'sinden indirebilirsiniz: https://www.postgresql.org/download/

Alternatif kurulum yöntemleri:
```bash
# macOS (Homebrew)
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2️⃣ PostgreSQL Başlatma

```bash
# macOS
brew services start postgresql@15

# Ubuntu/Debian
sudo systemctl start postgresql

# Windows (Service olarak çalışır, manual başlatmaya gerek yok)

# Kurulumu kontrol et
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

### 4️⃣ .env Dosyası Oluşturma

```bash
cd backend
cp .env.example .env
```

`.env` dosyasının içeriği (örnek):

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=<güvenli-bir-anahtar>
JWT_EXPIRATION=1d
DB_HOST=localhost
DB_PORT=5432
DB_USER=<veritabanı-kullanıcısı>
DB_PASSWORD=<veritabanı-şifresi>
DB_NAME=gamevault
DB_LOGGING=false
DB_SYNCHRONIZE=true
```

⚠️ **Önemli:** `.env` dosyasını asla version control'e commit etmeyin!

### 5️⃣ Uygulama Başlatma

```bash
cd backend
npm install
npm run start:dev
```

**✅ Başarılı oldu!** 

TypeORM otomatik olarak:
- ✓ Database'e bağlanır
- ✓ Tüm tabloları oluşturur (eğer yoksa)
- ✓ Tabloları senkronize eder (development ortamında)
- ✓ Varsayılan rolleri (ADMIN, SELLER, BUYER) ekler
- ✓ Seeding verilerini oluşturur (Transaction desteği ile atomik işlemler)

API'yi ziyaret et: Swagger UI (development ortamında http://localhost:3000/api adresinde)

### 6️⃣ Önemli: Production Ayarları

Production ortamında aşağıdaki değişiklikleri yapın:

```env
DB_SYNCHRONIZE=false  # Manuel migration veya oto-migration tools kullanın
NODE_ENV=production
# Güvenli şifre ve JWT secret kullanın
```

**Not:** TypeORM transaction mekanizması ürün siparişlerinde stok güncellemelerini korur, concurrent işlemlerde veri tutarlılığını sağlar.

---

## 📊 Entity Diyagramı

```
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA DIAGRAM                     │
└──────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    games     │
                              │──────────────│
                              │ id (PK)      │
                              │ name (UNIQUE)│
                              │ platform     │
                              │ genre        │
                              └────────┬─────┘
                                       │ 1:N
                                       │
┌──────────────────────┐       ┌───────▼─────────────┐
│      users           │       │     products        │
│──────────────────────│       │─────────────────────│
│ id (PK)              │◄──────┤ id (PK)             │
│ email (UNIQUE)       │ 1:N   │ title               │
│ username (UNIQUE)    │       │ description         │
│ passwordHash         │       │ type (ENUM)         │
│ createdAt            │       │ price (>0)          │
│ updatedAt            │       │ currency            │
└──┬──────────────────┘       │ stock (>=0)         │
   │ M:N                       │ isActive            │
   │                           │ sellerId (FK→users)  │
   │                           │ gameId (FK→games)   │
   │          ┌────────────────┤ createdAt           │
   │          │                │ updatedAt           │
   │  ┌───────▼────┐           └──────┬──────────────┘
   │  │user_roles  │                  │ M:1
   │  │────────────│                  │
   │  │userId (FK) │                  │
   │  │roleId (FK) │                  │
   │  │PRIMARY (userId, roleId)       │
   │  └───────┬────┘                  │
   │          │ M:N                   │
   └─────────┤                        │
             │                        │
      ┌──────▼─────┐           ┌──────▼──────────┐
      │   roles    │           │     orders      │
      │────────────│           │─────────────────│
      │ id (PK)    │           │ id (PK)         │
      │ name (UNIQUE)          │ buyerId (FK)    │
      │ description│           │ status (ENUM)   │
      └────────────┘           │ totalPrice      │
                               │ createdAt       │
                               └────────┬────────┘
                                        │ 1:N
                                        │
                                 ┌──────▼──────────┐
                                 │  order_items    │
                                 │──────────────────│
                                 │ id (PK)          │
                                 │ orderId (FK)     │
                                 │ productId (FK)   │
                                 │ quantity         │
                                 │ unitPrice        │
                                 └──────────────────┘

LEGEND:
  PK     = Primary Key
  FK     = Foreign Key
  1:N    = One-to-Many
  M:N    = Many-to-Many
  (...)  = Constraint
```

---

## 📋 Tablolar

### 1️⃣ `users` - Kullanıcılar

**Tanım:** Sistemdeki tüm kullanıcıları depolamak için ana tablo.

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz kullanıcı ID |
| `email` | VARCHAR | UNIQUE, NOT NULL | Kullanıcı email adresi |
| `username` | VARCHAR | UNIQUE, NOT NULL | Kullanıcı adı |
| `passwordHash` | VARCHAR | NOT NULL | Şifrelenmiş şifre (bcrypt) |
| `createdAt` | TIMESTAMP | NOT NULL | Oluşturulma tarihi |
| `updatedAt` | TIMESTAMP | NOT NULL | Güncellenme tarihi |

---

### 2️⃣ `roles` - Roller

**Tanım:** Sistem rolleri ve izinleri tanımlamak için tablo.

```typescript
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz rol ID |
| `name` | VARCHAR | UNIQUE, NOT NULL | Rol adı |
| `description` | VARCHAR | Nullable | Rol açıklaması |

**Varsayılan Roller:**
- `ADMIN` - Platform yöneticileri
- `SELLER` - Ürün satabilen kullanıcılar
- `BUYER` - Ürün satın alabilen kullanıcılar (varsayılan)

---

### 3️⃣ `user_roles` - Kullanıcı-Rol İlişkisi

**Tanım:** Many-to-Many junction table

| Kolon | Tip | Constraints |
|-------|-----|-----------|
| `userId` | INTEGER | FK (users.id), PK |
| `roleId` | INTEGER | FK (roles.id), PK |

---

### 4️⃣ `games` - Oyunlar

**Tanım:** Satılan oyunların katalogunu tutmak için tablo.

```typescript
@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column({ nullable: true })
  genre?: string;

  @OneToMany(() => Product, (product) => product.game)
  products: Product[];
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz oyun ID |
| `name` | VARCHAR | UNIQUE, NOT NULL | Oyun adı |
| `platform` | VARCHAR | NOT NULL | Platform (PC, Console, Mobile) |
| `genre` | VARCHAR | Nullable | Oyun türü (Action, RPG, etc) |

---

### 5️⃣ `products` - Ürünler

**Tanım:** Satılan ürünleri (hesaplar ve anahtarlar) tutmak için ana tablo.

```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ default: 1 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  seller: User;

  @ManyToOne(() => Game, (game) => game.products, { eager: true })
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz ürün ID |
| `title` | VARCHAR | NOT NULL | Ürün başlığı |
| `description` | TEXT | Nullable | Ürün açıklaması |
| `type` | ENUM | NOT NULL | Ürün tipi (ACCOUNT, KEY) |
| `price` | DECIMAL(10,2) | NOT NULL, >0 | Fiyat |
| `currency` | VARCHAR | DEFAULT 'TRY' | Para birimi |
| `stock` | INTEGER | >=0 | Stok miktarı |
| `isActive` | BOOLEAN | DEFAULT true | Ürün aktif mi (satıcı tarafından kontrol edilebilir) |
| `sellerId` | INTEGER | FK (users.id) | Satıcı ID |
| `gameId` | INTEGER | FK (games.id) | İlgili oyun ID |
| `createdAt` | TIMESTAMP | NOT NULL | Oluşturulma tarihi |
| `updatedAt` | TIMESTAMP | NOT NULL | Güncellenme tarihi |

---

### 6️⃣ `orders` - Siparişler

**Tanım:** Müşterilerin siparişlerini tutmak için ana tablo.

```typescript
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  buyer: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz sipariş ID |
| `buyerId` | INTEGER | FK (users.id) | Alıcı ID |
| `status` | ENUM | DEFAULT 'PENDING' | Sipariş durumu |
| `totalPrice` | DECIMAL(10,2) | NOT NULL | Toplam fiyat |
| `createdAt` | TIMESTAMP | NOT NULL | Sipariş tarihi |

---

### 7️⃣ `order_items` - Sipariş Satırları

**Tanım:** Siparişlerdeki ürünleri tutmak için junction table.

```typescript
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
```

| Kolon | Tip | Constraints | Açıklama |
|-------|-----|-----------|----------|
| `id` | SERIAL | PK | Benzersiz satır ID |
| `orderId` | INTEGER | FK (orders.id) | Sipariş ID |
| `productId` | INTEGER | FK (products.id) | Ürün ID |
| `quantity` | INTEGER | >0 | Ürün miktarı |
| `unitPrice` | DECIMAL(10,2) | >0 | Satın alındığı andaki fiyat |

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
```typescript
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

---

### OrderStatus

```typescript
enum OrderStatus {
  PENDING = 'PENDING',       // Sipariş alındı, işleme alındı
  PAID = 'PAID',             // Ödeme alındı
  COMPLETED = 'COMPLETED',   // Ürünler teslim edildi
  CANCELLED = 'CANCELLED'    // Sipariş iptal edildi
}
```

---

### RoleNames

```typescript
enum RoleNames {
  ADMIN = 'ADMIN',      // Platform yöneticileri
  SELLER = 'SELLER',    // Ürün satabilen kullanıcılar
  BUYER = 'BUYER'       // Ürün satın alabilen kullanıcılar
}
```

---

## 🔒 Constraints

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
ADD CONSTRAINT check_product_price CHECK (price > 0);

ALTER TABLE products 
ADD CONSTRAINT check_product_stock CHECK (stock >= 0);

ALTER TABLE order_items 
ADD CONSTRAINT check_order_item_quantity CHECK (quantity > 0);

ALTER TABLE order_items 
ADD CONSTRAINT check_order_item_price CHECK (unitPrice > 0);
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

-- User Roles (CASCADE DELETE)
ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_userId 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_roleId 
FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE;
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

## 📦 Veritabanı Yedekleme

### Backup Alma

```bash
# Tüm veritabanını backup al
pg_dump -U postgres -h localhost gamevault > backup.sql

# Kompres ederek backup al
pg_dump -U postgres gamevault | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Backup Geri Yükleme

```bash
# Backup'tan restore et
psql -U postgres gamevault < backup.sql

# Kompres edilmiş backup'tan restore et
gunzip -c backup_20251201_120000.sql.gz | psql -U postgres gamevault
```

---

## 🔍 TypeORM Configuration

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'gamevault',
    autoLoadEntities: true,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  }),
})
```

---

**Son Güncelleme:** 1 Aralık 2025  
**Proje:** [Full_Stack_Web_Project](https://github.com/mozybali/Full_Stack_Web_Project)

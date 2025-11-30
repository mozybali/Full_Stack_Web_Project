# Geliştirme Rehberi (Development Guide)

## 📋 İçindekiler

- [Coding Standards](#coding-standards)
- [Project Conventions](#project-conventions)
- [Git Workflow](#git-workflow)
- [Testing Strategy](#testing-strategy)
- [Security Best Practices](#security-best-practices)
- [Performance Tips](#performance-tips)
- [Debugging](#debugging)
- [Deployment](#deployment)

---

## 📝 Coding Standards

### TypeScript Backend

#### File Organization

```typescript
// ✅ GOOD - Organized imports
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

// ❌ BAD - Mixed order
import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
```

#### Naming Conventions

```typescript
// Services
export class ProductsService { }  // PascalCase, plural form
export class UserService { }      // PascalCase, singular

// DTOs
export class CreateProductDto { } // Verb + Noun + Dto suffix
export class UpdateProductDto { }
export class FilterProductsDto { }

// Entities
export class Product { }          // PascalCase, singular
export class User { }

// Methods
async createProduct(dto: CreateProductDto) { }     // camelCase, verb
async findOne(id: number) { }
async deleteById(id: number) { }

// Variables
const totalPrice = 0;             // camelCase
let isActive = true;
const MAX_RETRIES = 3;            // UPPER_CASE for constants
```

#### Class Structure

```typescript
@Injectable()
export class ProductsService {
  // 1. Constructor & Dependencies
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    private readonly gamesService: GamesService,
  ) {}

  // 2. Public Methods (CRUD first)
  async create(dto: CreateProductDto, userId: number): Promise<Product> {
    return this.productsRepo.save({
      ...dto,
      seller: { id: userId },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepo.find({ relations: ['seller', 'game'] });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepo.findOne({
      where: { id },
      relations: ['seller', 'game'],
    });
  }

  // 3. Business Logic Methods
  private calculateTotalPrice(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  // 4. Private Helper Methods
  private validateStock(product: Product, quantity: number): void {
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
  }
}
```

#### Error Handling

```typescript
// ✅ GOOD - Specific error types
import { HttpException, BadRequestException, NotFoundException } from '@nestjs/common';

async findOne(id: number) {
  const product = await this.productsRepo.findOne({ where: { id } });
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  return product;
}

// ❌ BAD - Generic errors
throw new Error('Product not found');
```

#### Type Safety

```typescript
// ✅ GOOD - Explicit types
interface CreateProductInput {
  title: string;
  price: number;
  stock: number;
}

function createProduct(input: CreateProductInput): Product {
  return this.productsRepo.create(input);
}

// ❌ BAD - Using any
function createProduct(input: any): any {
  return this.productsRepo.create(input);
}
```

---

### JavaScript/React Frontend

#### Component Structure

```jsx
// ✅ GOOD - Organized component
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/ui/Button';
import { useAsync } from '../common/hooks/useAsync';

function ProductCard({ product, onAddToCart }) {
  // 1. Hooks
  const [quantity, setQuantity] = useState(1);
  const { value: stock, error: stockError } = useAsync(
    () => checkStock(product.id)
  );

  // 2. Event handlers (memoized)
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id, quantity);
    setQuantity(1);
  }, [product.id, quantity, onAddToCart]);

  // 3. JSX
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>Price: ₺{product.price}</p>
      <Button onClick={handleAddToCart}>Add</Button>
    </div>
  );
}

// 4. Prop validation
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.required,
    title: PropTypes.string.required,
  }).required,
  onAddToCart: PropTypes.func.required,
};

export default ProductCard;
```

#### Naming Conventions

```javascript
// Components
function ProductCard() { }        // PascalCase, singular noun
function UserProfile() { }

// Custom Hooks
function useAsync(fn, immediate) { }    // Use prefix
function useFetch(url) { }

// Regular Functions/Methods
const handleClick = () => { }     // camelCase, handler prefix
const fetchProducts = () => { }
const formatPrice = (price) => { } // Utility prefix

// Variables
const [isOpen, setIsOpen] = useState(false);  // camelCase
const filteredProducts = useMemo(() => {}, []); // camelCase
const USER_ROLES = ['ADMIN', 'USER'];         // UPPER_CASE for constants

// Event handlers
const handleSubmit = (e) => { }   // handleXxx pattern
const handleInputChange = (e) => { }
```

#### Conditional Rendering

```jsx
// ✅ GOOD - Clear and readable
{user && <UserProfile user={user} />}
{isLoading ? <Spinner /> : <ProductList products={products} />}
{products.length > 0 ? <List /> : <EmptyState />}

// ❌ BAD - Confusing
{user && user.isAdmin && <AdminPanel />}  // Unclear intent
{status === 'loading' && <Spinner />}

// ✅ BETTER - Extract complex logic
const shouldShowAdminPanel = user && user.isAdmin;
{shouldShowAdminPanel && <AdminPanel />}
```

---

## 🎯 Project Conventions

### Folder Structure Convention

**Backend:**
```
src/
├── [feature]/
│   ├── [feature].controller.ts     # HTTP layer
│   ├── [feature].service.ts        # Business logic
│   ├── [feature].module.ts         # Module definition
│   ├── [feature].entity.ts         # Database entity
│   ├── dto/
│   │   ├── create-[feature].dto.ts
│   │   ├── update-[feature].dto.ts
│   │   └── filter-[feature].dto.ts
│   └── ...
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── pipes/
│   └── utils/
└── config/
```

**Frontend:**
```
src/
├── features/
│   ├── [feature]/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── pages/
│   │   └── services/
├── common/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── utils/
└── layouts/
```

### Import Path Aliases

**Backend (tsconfig.json):**
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@auth/*": ["src/auth/*"],
      "@common/*": ["src/common/*"]
    }
  }
}
```

**Frontend (vite.config.js):**
```javascript
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@hooks': path.resolve(__dirname, './src/common/hooks'),
    },
  },
};
```

**Usage:**
```typescript
// ✅ GOOD
import { UsersService } from '@auth/users.service';
import { AuthGuard } from '@common/guards/auth.guard';

// ❌ BAD
import { UsersService } from '../../auth/users.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
```

---

## 🌳 Git Workflow

### Branch Naming Convention

```
main              # Production ready
├── develop       # Development branch
│   ├── feature/xxx        # Yeni özellik
│   ├── bugfix/xxx         # Bug fix
│   ├── refactor/xxx       # Refactoring
│   └── chore/xxx          # Maintenance
```

**Examples:**
```bash
git checkout -b feature/user-authentication
git checkout -b bugfix/cart-price-calculation
git checkout -b refactor/product-service
git checkout -b chore/update-dependencies
```

### Commit Message Convention

```bash
# Format: <type>(<scope>): <subject>
# Max length: 50 characters

git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(products): prevent duplicate entries"
git commit -m "docs(api): update endpoint documentation"
git commit -m "style(frontend): format button component"
git commit -m "refactor(users): simplify user service"
git commit -m "test(orders): add order creation tests"
git commit -m "chore(deps): update nestjs to v11"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Dependencies, config, etc.

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit regularly
3. Push to remote
4. Create PR with description
5. Code review (minimum 1 approval)
6. Merge to `develop`
7. Delete feature branch

---

## 🧪 Testing Strategy

### Backend Testing

```typescript
// products.service.spec.ts
import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100 },
        { id: 2, title: 'Product 2', price: 200 },
      ];

      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto = { title: 'New Product', price: 150 };
      const mockProduct = { id: 1, ...createDto };

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createDto, 1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });
});
```

### Frontend Testing

```javascript
// ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    stock: 5,
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it('should render product information', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₺100')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart}
      />
    );

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(mockOnAddToCart).toHaveBeenCalledWith(1, 1);
  });
});
```

---

## 🔒 Security Best Practices

### Backend

```typescript
// ✅ GOOD - Secure practices
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Hash passwords
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare passwords
  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  // Validate input
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Sanitize input
  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}
```

```typescript
// ❌ BAD - Security issues
// Storing plaintext passwords
this.userRepository.save({ 
  email, 
  password: plainPassword  // NEVER!
});

// Hardcoded secrets
const JWT_SECRET = 'my-secret-key';

// SQL injection risk
query(`SELECT * FROM users WHERE email = '${email}'`);
```

### Frontend

```javascript
// ✅ GOOD - Security practices
import DOMPurify from 'dompurify';

// Sanitize HTML
const cleanHtml = DOMPurify.sanitize(userInput);

// Store tokens securely
const setToken = (token) => {
  // Use httpOnly cookies (server-side)
  // Or secure sessionStorage
  sessionStorage.setItem('token', token);
};

// Never log sensitive data
console.log({ username, email }); // ✅ OK
console.log({ username, password }); // ❌ NEVER!
```

---

## ⚡ Performance Tips

### Backend

```typescript
// ✅ Use pagination
async getProducts(page = 1, limit = 20): Promise<Product[]> {
  const skip = (page - 1) * limit;
  return this.productsRepo.find({
    skip,
    take: limit,
  });
}

// ✅ Use database indexes
@Entity()
export class Product {
  @Index()
  @Column()
  gameId: number;
}

// ✅ Use select specific fields
const product = await this.productsRepo.find({
  select: ['id', 'title', 'price'],  // Not all fields
});

// ✅ Cache frequently accessed data
@Cacheable()
async getGameCatalog(): Promise<Game[]> {
  return this.gamesRepo.find();
}
```

### Frontend

```javascript
// ✅ Use React.memo for expensive components
const ProductCard = React.memo(({ product }) => {
  return <div>{product.title}</div>;
});

// ✅ Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return products.filter(p => p.price < 100).map(p => p.title);
}, [products]);

// ✅ Use useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);

// ✅ Lazy load routes
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// ✅ Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';
```

---

## 🐛 Debugging

### Backend Debugging

```typescript
// Using VS Code debugger
// Add launch.json configuration:
{
  "type": "node",
  "request": "launch",
  "name": "NestJS Debugger",
  "program": "${workspaceFolder}/node_modules/.bin/nest",
  "args": ["start", "--watch", "--debug"],
  "cwd": "${workspaceFolder}/backend"
}
```

### Frontend Debugging

```javascript
// React DevTools Browser Extension
// Recommended: React DevTools + Zustand DevTools

// Debug state
import useStore from './store';
const state = useStore((state) => state);
console.log('Current state:', state);

// Debug component renders
import { Profiler } from 'react';

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList />
</Profiler>
```

---

## 🚀 Deployment

### Build Process

**Backend:**
```bash
npm run build          # Compile TypeScript
npm run start:prod     # Start production server
```

**Frontend:**
```bash
npm run build          # Create optimized build
npm run preview        # Preview production build
```

### Environment Variables

Never commit `.env` files. Use `.env.example` as template.

**Backend .env:**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-secret-key
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USER=production_user
DB_PASSWORD=production_password
DB_NAME=gamevault_prod
```

**Frontend .env:**
```env
VITE_API_URL=https://api.gamevault.com
VITE_APP_NAME=GameVault
```

---

**Son Güncelleme**: 30 Kasım 2025


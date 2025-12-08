// Backend enums
export enum RoleNames {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  BUYER = 'BUYER',
}

export enum ProductType {
  ACCOUNT = 'ACCOUNT',
  KEY = 'KEY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Entities
export interface Role {
  id: number;
  name: RoleNames;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: number;
  name: string;
  platform: string;
  genre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  type: ProductType;
  price: number;
  currency: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  seller: User;
  game: Game;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  buyer: User;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProductDto {
  title: string;
  description?: string;
  type: ProductType;
  price: number;
  stock: number;
  gameId: number;
  image?: File;
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  type?: ProductType;
  price?: number;
  stock?: number;
  gameId?: number;
  image?: File;
}

export interface CreateOrderDto {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface UpdateOrderDto {
  status: OrderStatus;
}

export interface CreateGameDto {
  name: string;
  platform: string;
  genre?: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode: number;
}

// Auth
export interface AuthResponse {
  access_token: string;
  user: User;
}

// Cart
export interface CartItem {
  product: Product;
  quantity: number;
}

import axiosInstance from './axios';
import type { Product, CreateProductDto, UpdateProductDto } from '../types';

export const productService = {
  // Tüm ürünleri getir
  async getAll(): Promise<Product[]> {
    const response = await axiosInstance.get<Product[]>('/products');
    return response.data;
  },

  // ID'ye göre ürün getir
  async getById(id: number): Promise<Product> {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Yeni ürün oluştur (resim ile)
  async create(data: CreateProductDto): Promise<Product> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('gameId', data.gameId.toString());
    if (data.image) formData.append('image', data.image);

    const response = await axiosInstance.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Ürün güncelle
  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.gameId !== undefined) formData.append('gameId', data.gameId.toString());
    if (data.image) formData.append('image', data.image);

    const response = await axiosInstance.put<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Ürün sil
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/products/${id}`);
  },
};

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { RoleNames } from '../common/enums/role-names.enum';

/**
 * Ürün yönetimi servisi
 * Ürün oluşturma, güncelleme ve yönetim işlemlerini gerçekleştirir
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  /**
   * Tüm ürünleri getir
   * @returns Ürünler listesi
   */
  findAll() {
    return this.productsRepo.find({
      relations: ['seller', 'game'],
    });
  }

  /**
   * ID'ye göre ürün bul
   * @param id - Ürün ID'si
   * @returns Ürün detayları
   */
  findOne(id: number) {
    return this.productsRepo.findOne({
      where: { id },
      relations: ['seller', 'game'],
    });
  }

  /**
   * Yeni ürün oluştur
   * @param dto - Ürün oluşturma DTO'su
   * @param sellerId - Satıcı ID'si
   * @returns Oluşturulan ürün
   */
  create(dto: CreateProductDto, sellerId: number) {
    const product = this.productsRepo.create({
      ...dto,
      seller: { id: sellerId },
      game: { id: dto.gameId },
    });
    return this.productsRepo.save(product);
  }

  /**
   * Ürün bilgilerini güncelle
   * @param id - Ürün ID'si
   * @param dto - Ürün güncelleme DTO'su
   * @param userId - İsteği yapan kullanıcı ID'si (yetki kontrolü için)
   * @returns Güncellenen ürün
   */
  async update(id: number, dto: UpdateProductDto, userId?: number) {
    const product = await this.findOne(id);
    
    if (!product) {
      throw new NotFoundException(`Ürün ${id} bulunamadı`);
    }

    // Satıcı kendi ürününü güncelleyebilir veya admin güncelleyebilir
    if (userId && product.seller.id !== userId) {
      throw new ForbiddenException('Sadece ürün sahibi bu ürünü güncelleyebilir');
    }

    // Güncelleme verilerini hazırla
    const updateData: any = { ...dto };
    if (dto.gameId) {
      updateData.game = { id: dto.gameId };
    }
    delete updateData.gameId;

    await this.productsRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Ürünü sil
   * @param id - Silinecek ürün ID'si
   * @param userId - İsteği yapan kullanıcı ID'si (yetki kontrolü için)
   * @returns Silme işlemi başarılı mı
   */
  async remove(id: number, userId?: number) {
    const product = await this.findOne(id);
    
    if (!product) {
      throw new NotFoundException(`Ürün ${id} bulunamadı`);
    }

    // Satıcı kendi ürününü silebilir veya admin silebilir
    if (userId && product.seller.id !== userId) {
      throw new ForbiddenException('Sadece ürün sahibi bu ürünü silebilir');
    }

    await this.productsRepo.delete(id);
    return { deleted: true };
  }

  /**
   * Ürün stoğunu güncelle
   * @param id - Ürün ID'si
   * @param newStock - Yeni stok miktarı
   * @returns Güncellenen ürün
   */
  async updateStock(id: number, newStock: number) {
    const product = await this.findOne(id);
    
    if (!product) {
      throw new NotFoundException(`Ürün ${id} bulunamadı`);
    }

    if (newStock < 0) {
      throw new ForbiddenException('Stok miktarı negatif olamaz');
    }

    await this.productsRepo.update(id, { stock: newStock });
    return this.findOne(id);
  }
}

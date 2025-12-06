import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { RoleNames } from '../common/enums/role-names.enum';
import { UploadService } from '../upload/upload.service';

/**
 * Ürün yönetimi servisi
 * Ürün oluşturma, güncelleme ve yönetim işlemlerini gerçekleştirir
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly uploadService: UploadService,
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
   * Satıcı ID'ye göre ürünleri bul
   * Belirtilen satıcının tüm ürünlerini döndürür
   * @param sellerId - Satıcı ID'si
   * @returns Satıcının ürünleri
   */
  findBySellerId(sellerId: number) {
    return this.productsRepo.find({
      where: { seller: { id: sellerId } },
      relations: ['seller', 'game'],
    });
  }

  /**
   * Yeni ürün oluştur
   * @param dto - Ürün oluşturma DTO'su
   * @param sellerId - Satıcı ID'si
   * @param imageFile - Ürün resmi (opsiyonel)
   * @returns Oluşturulan ürün
   */
  async create(dto: CreateProductDto, sellerId: number, imageFile?: Express.Multer.File) {
    let imageUrl = dto.imageUrl;

    // Eğer dosya yüklendiyse, işle ve kaydet
    if (imageFile) {
      imageUrl = await this.uploadService.uploadProductImage(imageFile);
    }

    const product = this.productsRepo.create({
      ...dto,
      imageUrl,
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
   * @param imageFile - Yeni ürün resmi (opsiyonel)
   * @returns Güncellenen ürün
   */
  async update(id: number, dto: UpdateProductDto, userId?: number, imageFile?: Express.Multer.File) {
    // Transaction ile güncelleme yap ve race condition'ı önle
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Pessimistic write lock ile ürünü kilitle
      const product = await queryRunner.manager.findOne(Product, {
        where: { id },
        relations: ['seller', 'game'],
        lock: { mode: 'pessimistic_write' },
      });
      
      if (!product) {
        throw new NotFoundException(`Ürün ${id} bulunamadı`);
      }

      // Satıcı kendi ürününü güncelleyebilir veya admin güncelleyebilir
      if (userId && product.seller.id !== userId) {
        throw new ForbiddenException('Sadece ürün sahibi bu ürünü güncelleyebilir');
      }

      // Eğer yeni resim yüklendiyse, eski resmi sil ve yenisini kaydet
      let imageUrl = dto.imageUrl;
      if (imageFile) {
        imageUrl = await this.uploadService.updateProductImage(product.imageUrl || '', imageFile);
      }

      // Güncelleme verilerini hazırla
      const updateData: any = { ...dto };
      if (imageFile || dto.imageUrl) {
        updateData.imageUrl = imageUrl;
      }
      if (dto.gameId) {
        updateData.game = { id: dto.gameId };
      }
      delete updateData.gameId;

      // Lock tutulurken güncelle
      await queryRunner.manager.update(Product, id, updateData);
      
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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

    // Ürün resmini sil
    if (product.imageUrl) {
      await this.uploadService.deleteProductImage(product.imageUrl);
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
    // Transaction ile stok güncellemesi yap - race condition'ı önle
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Pessimistic write lock ile ürünü kilitle
      const product = await queryRunner.manager.findOne(Product, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      
      if (!product) {
        throw new NotFoundException(`Ürün ${id} bulunamadı`);
      }

      if (newStock < 0) {
        throw new ForbiddenException('Stok miktarı negatif olamaz');
      }

      // Lock tutulurken stok güncelle
      await queryRunner.manager.update(Product, id, { stock: newStock });
      
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

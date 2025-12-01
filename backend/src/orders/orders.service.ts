import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { ProductsService } from '../products/products.service';
import { RoleNames } from '../common/enums/role-names.enum';

/**
 * Sipariş yönetimi servisi
 * Sipariş oluşturma ve yönetim işlemlerini gerçekleştirir
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Yeni sipariş oluştur
   * @param dto - Sipariş oluşturma DTO'su
   * @param userId - Alıcı kullanıcı ID'si
   * @returns Oluşturulan sipariş
   */
  async create(dto: CreateOrderDto, userId: number) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Sipariş en az bir öğe içermesi gereklidir');
    }

    // Transaction ile siparişi oluştur ve stoğu güncelle (race condition önlemek için)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: Partial<OrderItem>[] = [];

      // Tüm ürünleri kontrol et ve stokları lock ile oku
      for (const item of dto.items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new BadRequestException(`Ürün ${item.productId} bulunamadı`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`${product.title} için yeterli stok yok`);
        }

        totalPrice += Number(product.price) * item.quantity;
        orderItems.push({
          product,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // Sipariş oluştur
      const order = this.ordersRepo.create({
        buyer: { id: userId },
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Stokları güncelle (transaction içinde)
      for (const item of dto.items) {
        const product = await this.productsService.findOne(item.productId);
        if (product) {
          const newStock = product.stock - item.quantity;
          await queryRunner.manager.update('products', { id: item.productId }, { stock: newStock });
        }
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Kullanıcının siparişlerini getir
   * @param userId - Kullanıcı ID'si
   * @returns Kullanıcının siparişleri
   */
  findMy(userId: number) {
    return this.ordersRepo.find({
      where: { buyer: { id: userId } },
      relations: ['buyer', 'items', 'items.product'],
    });
  }

  /**
   * Tüm siparişleri getir (Admin)
   * @returns Tüm siparişler
   */
  findAll(skip: number = 0, take: number = 20) {
    // Pagination ile siparişleri getir (N+1 query problemi azaltılır)
    return this.ordersRepo.find({
      relations: ['buyer', 'items', 'items.product'],
      skip: Math.max(0, skip),
      take: Math.min(100, Math.max(1, take)),  // Max 100 item per page
    });
  }

  /**
   * ID'ye göre sipariş bul
   * @param id - Sipariş ID'si
   * @param user - İsteği yapan kullanıcı (yetki kontrolü için)
   * @returns Sipariş detayları
   */
  async findOne(id: number, user?: any) {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['buyer', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Sipariş ${id} bulunamadı`);
    }

    // Sadece kendi siparişini görebilir veya admin tüm siparişleri görebilir
    if (user && order.buyer.id !== user.sub && !user.roles?.includes(RoleNames.ADMIN)) {
      throw new ForbiddenException('Bu siparişi görüntülemek için yetkiniz yok');
    }

    return order;
  }

  /**
   * Sipariş durumunu güncelle (Admin)
   * @param id - Sipariş ID'si
   * @param dto - Güncelleme DTO'su
   * @returns Güncellenen sipariş
   */
  async updateStatus(id: number, dto: UpdateOrderDto) {
    const order = await this.ordersRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Sipariş ${id} bulunamadı`);
    }

    await this.ordersRepo.update(id, { status: dto.status });
    return this.findOne(id);
  }
}

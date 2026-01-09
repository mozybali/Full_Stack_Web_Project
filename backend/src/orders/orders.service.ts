import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
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
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
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

      // Tüm ürünleri kontrol et ve stokları pessimistic lock ile oku (race condition önleme)
      for (const item of dto.items) {
        // Pessimistic write lock ile ürünü kilitle - aynı anda başka transaction değiştiremez
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' }
        });
        
        if (!product) {
          throw new BadRequestException(`Ürün ${item.productId} bulunamadı`);
        }
        
        if (!product.isActive) {
          throw new BadRequestException(`${product.title} artık satışta değil`);
        }
        
        if (product.stock < item.quantity) {
          throw new BadRequestException(`${product.title} için yeterli stok yok (Mevcut: ${product.stock}, İstenen: ${item.quantity})`);
        }

        totalPrice += Number(product.price) * item.quantity;
        orderItems.push({
          product,
          quantity: item.quantity,
          unitPrice: product.price,
        });
        
        // Stoğu hemen güncelle (lock tutulurken)
        product.stock -= item.quantity;
        await queryRunner.manager.save(Product, product);
      }

      // Sipariş oluştur
      const order = this.ordersRepo.create({
        buyer: { id: userId },
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

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
      relations: ['buyer', 'items', 'items.product', 'items.product.game'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Satıcının ürünlerine ait siparişleri getir
   * @param sellerId - Satıcı ID'si
   * @returns Satıcının ürünlerine ait siparişler
   */
  async findSellerOrders(sellerId: number) {
    const orders = await this.ordersRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.game', 'game')
      .leftJoinAndSelect('product.seller', 'seller')
      .where('seller.id = :sellerId', { sellerId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    return orders;
  }

  /**
   * Tüm siparişleri getir (Admin)
   * @returns Tüm siparişler
   */
  findAll(skip: number = 0, take: number = 20) {
    // Pagination ile siparişleri getir (N+1 query problemi azaltılır)
    return this.ordersRepo.find({
      relations: ['buyer', 'items', 'items.product', 'items.product.game'],
      skip: Math.max(0, skip),
      take: Math.min(100, Math.max(1, take)),  // Max 100 item per page
      order: { createdAt: 'DESC' },
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
      relations: ['buyer', 'items', 'items.product', 'items.product.game'],
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

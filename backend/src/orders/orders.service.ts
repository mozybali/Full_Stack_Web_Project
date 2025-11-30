import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { ProductsService } from '../products/products.service';

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

    let totalPrice = 0;
    const orderItems: Partial<OrderItem>[] = [];

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

    const order = this.ordersRepo.create({
      buyer: { id: userId },
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    return this.ordersRepo.save(order);
  }

  /**
   * Kullanıcının siparişlerini getir
   * @param userId - Kullanıcı ID'si
   * @returns Kullanıcının siparişleri
   */
  findMy(userId: number) {
    return this.ordersRepo.find({
      where: { buyer: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  /**
   * Tüm siparişleri getir (Admin)
   * @returns Tüm siparişler
   */
  findAll() {
    return this.ordersRepo.find({
      relations: ['buyer', 'items', 'items.product'],
    });
  }

  /**
   * ID'ye göre sipariş bul
   * @param id - Sipariş ID'si
   * @returns Sipariş detayları
   */
  findOne(id: number) {
    return this.ordersRepo.findOne({
      where: { id },
      relations: ['buyer', 'items', 'items.product'],
    });
  }
}

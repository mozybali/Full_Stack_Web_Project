import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDto, userId: number) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.title}`);
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

  findMy(userId: number) {
    return this.ordersRepo.find({
      where: { buyer: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  findAll() {
    return this.ordersRepo.find({
      relations: ['buyer', 'items', 'items.product'],
    });
  }

  findOne(id: number) {
    return this.ordersRepo.findOne({
      where: { id },
      relations: ['buyer', 'items', 'items.product'],
    });
  }
}

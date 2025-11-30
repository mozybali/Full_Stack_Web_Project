import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

/**
 * Sipariş Öğesi Entity'si
 * Siparişlerdeki ürünleri tutmak için kullanılır (junction table)
 */
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // İlişkili sipariş
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  // Sipariş içindeki ürün
  @ManyToOne(() => Product)
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}

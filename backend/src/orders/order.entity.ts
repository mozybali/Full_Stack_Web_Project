import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../common/enums/order-status.enum';

/**
 * Sipariş Entity'si
 * Müşterilerin yaptığı siparişleri tutmak için kullanılır
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Sipariş veren alıcı
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  buyer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // Siparişteki ürünler
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
}

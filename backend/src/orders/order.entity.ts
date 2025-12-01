import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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
  @Index()
  @ManyToOne(() => User, (user) => user.orders, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Index()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // Siparişteki ürünler
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;
}

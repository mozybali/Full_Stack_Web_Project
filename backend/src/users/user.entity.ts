import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

/**
 * Kullanıcı Entity'si
 * Sistem kullanıcılarının bilgilerini tutmak için kullanılır
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Kullanıcının sahip olduğu roller
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  // Kullanıcının satışa sunduğu ürünler
  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  // Kullanıcının satın aldığı siparişler
  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
}

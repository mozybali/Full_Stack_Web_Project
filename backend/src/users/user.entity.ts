import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../roles/role.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

/**
 * Kullanıcı Entity'si
 * Sistem kullanıcılarının bilgilerini tutmak için kullanılır
 */
@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
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

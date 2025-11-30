import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '../common/enums/product-type.enum';
import { User } from '../users/user.entity';
import { Game } from '../games/game.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ default: 1 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  seller: User;

  @ManyToOne(() => Game, (game) => game.products, { eager: true })
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

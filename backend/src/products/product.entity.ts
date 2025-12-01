import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductType } from '../common/enums/product-type.enum';
import { User } from '../users/user.entity';
import { Game } from '../games/game.entity';

/**
 * Ürün Entity'si
 * Market'te satılan ürünleri (oyun hesapları ve anahtarları) tutmak için kullanılır
 */
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

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl?: string;

  @Index()
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Ürünü satışa sunan kullanıcı
  @Index()
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  // Ürünün ilişkili olduğu oyun
  @Index()
  @ManyToOne(() => Game, (game) => game.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

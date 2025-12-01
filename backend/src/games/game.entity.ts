import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Product } from '../products/product.entity';

/**
 * Oyun Entity'si
 * Market'te satılan oyunların katalogunu tutmak için kullanılır
 */
@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  platform: string;

  @Column({ nullable: true })
  genre?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Bu oyun için satışa sunulan ürünler
  @OneToMany(() => Product, (product) => product.game)
  products: Product[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity';

/**
 * Oyun Entity'si
 * Market'te satılan oyunların katalogunu tutmak için kullanılır
 */
@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column({ nullable: true })
  genre?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Bu oyun için satışa sunulan ürünler
  @OneToMany(() => Product, (product) => product.game)
  products: Product[];
}

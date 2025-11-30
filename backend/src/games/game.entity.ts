import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  // Bu oyun için satışa sunulan ürünler
  @OneToMany(() => Product, (product) => product.game)
  products: Product[];
}

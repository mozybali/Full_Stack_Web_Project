import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

/**
 * Rol Entity'si
 * Sistem rollerini tanımlamak için kullanılır (ADMIN, SELLER, BUYER)
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Bu role sahip olan kullanıcılar
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}

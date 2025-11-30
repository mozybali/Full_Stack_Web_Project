import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async createWithDefaultRole(dto: CreateUserDto) {
    const buyerRole = await this.rolesRepo.findOne({ where: { name: 'BUYER' } });
    const user = this.usersRepo.create({
      ...dto,
      roles: buyerRole ? [buyerRole] : [],
    });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.usersRepo.delete(id);
    return { deleted: true };
  }
}

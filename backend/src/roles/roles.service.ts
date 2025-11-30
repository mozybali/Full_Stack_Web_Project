import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async seedDefaults() {
    const defaults = [
      { name: 'ADMIN', description: 'Administrator' },
      { name: 'SELLER', description: 'Seller' },
      { name: 'BUYER', description: 'Buyer' },
    ];

    for (const d of defaults) {
      const exists = await this.rolesRepo.findOne({ where: { name: d.name } });
      if (!exists) {
        await this.rolesRepo.save(this.rolesRepo.create(d));
      }
    }
  }

  findAll() {
    return this.rolesRepo.find();
  }

  findOne(id: number) {
    return this.rolesRepo.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.rolesRepo.findOne({ where: { name } });
  }
}

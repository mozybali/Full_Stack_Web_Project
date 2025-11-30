import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

/**
 * Rol yönetimi servisi
 * Sistem rolleri oluşturma ve yönetim işlemlerini gerçekleştirir
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  /**
   * Varsayılan rolleri oluştur
   * Sadece yoksa oluşturur
   */
  async seedDefaults() {
    const defaults = [
      { name: 'ADMIN', description: 'Platform yöneticileri' },
      { name: 'SELLER', description: 'Ürün satıcıları' },
      { name: 'BUYER', description: 'Ürün alıcıları' },
    ];

    for (const d of defaults) {
      const exists = await this.rolesRepo.findOne({ where: { name: d.name } });
      if (!exists) {
        await this.rolesRepo.save(this.rolesRepo.create(d));
      }
    }
  }

  /**
   * Tüm rolleri getir
   * @returns Roller listesi
   */
  findAll() {
    return this.rolesRepo.find();
  }

  /**
   * ID'ye göre rol bul
   * @param id - Rol ID'si
   * @returns Rol detayları
   */
  findOne(id: number) {
    return this.rolesRepo.findOne({ where: { id } });
  }

  /**
   * Ada göre rol bul
   * @param name - Rol adı
   * @returns Rol detayları
   */
  findByName(name: string) {
    return this.rolesRepo.findOne({ where: { name } });
  }
}

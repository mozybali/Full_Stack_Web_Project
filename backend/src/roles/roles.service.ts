import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { RoleNames } from '../common/enums/role-names.enum';

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
      { name: RoleNames.ADMIN, description: 'Platform yöneticileri' },
      { name: RoleNames.SELLER, description: 'Ürün satıcıları' },
      { name: RoleNames.BUYER, description: 'Ürün alıcıları' },
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
  async findOne(id: number) {
    const role = await this.rolesRepo.findOne({ where: { id } });
    
    if (!role) {
      throw new NotFoundException(`Rol ${id} bulunamadı`);
    }
    
    return role;
  }

  /**
   * Ada göre rol bul
   * @param name - Rol adı
   * @returns Rol detayları
   */
  findByName(name: string) {
    return this.rolesRepo.findOne({ where: { name } });
  }

  /**
   * Yeni rol oluştur
   * @param dto - Rol oluşturma DTO'su
   * @returns Oluşturulan rol
   */
  async create(dto: CreateRoleDto) {
    const exists = await this.findByName(dto.name);
    if (exists) {
      throw new ConflictException(`${dto.name} adında bir rol zaten mevcut`);
    }

    const role = this.rolesRepo.create(dto);
    return this.rolesRepo.save(role);
  }

  /**
   * Rol bilgilerini güncelle
   * @param id - Rol ID'si
   * @param dto - Rol güncelleme DTO'su
   * @returns Güncellenen rol
   */
  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);

    // Rol adını güncelliyorsak, benzersizlik kontrolü yap
    if (dto.name && dto.name !== role.name) {
      const exists = await this.findByName(dto.name);
      if (exists) {
        throw new ConflictException(`${dto.name} adında bir rol zaten mevcut`);
      }
    }

    const result = await this.rolesRepo.update(id, dto);
    
    // Güncelleme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Rol ${id} bulunamadı veya güncellenemedi`);
    }
    
    return this.findOne(id);
  }

  /**
   * Rolü sil
   * @param id - Silinecek rol ID'si
   * @returns Silme işlemi başarılı mı
   */
  async remove(id: number) {
    const role = await this.findOne(id);

    // Varsayılan roller silinemez (güvenlik için)
    const defaultRoles = [RoleNames.ADMIN, RoleNames.SELLER, RoleNames.BUYER];
    if (defaultRoles.includes(role.name as RoleNames)) {
      throw new ConflictException(`${role.name} varsayılan bir rol olduğu için silinemez`);
    }

    const result = await this.rolesRepo.delete(id);
    
    // Silme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Rol ${id} silinemedi`);
    }
    
    return { deleted: true };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Kullanıcı yönetimi servisi
 * Kullanıcı oluşturma, silme ve sorgulama işlemlerini yönetir
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  /**
   * Varsayılan BUYER rolü ile yeni kullanıcı oluştur
   * @param dto - Kullanıcı oluşturma DTO'su (email, username, passwordHash)
   * @returns Oluşturulan kullanıcı
   */
  async createWithDefaultRole(dto: CreateUserDto) {
    // BUYER rolünü bul
    const buyerRole = await this.rolesRepo.findOne({ where: { name: 'BUYER' } });
    // Yeni kullanıcı nesnesi oluştur
    const user = this.usersRepo.create({
      ...dto,
      roles: buyerRole ? [buyerRole] : [],
    });
    // Veritabanına kaydet ve döndür
    return this.usersRepo.save(user);
  }

  /**
   * Tüm kullanıcıları getir
   * @returns Kullanıcılar listesi
   */
  findAll() {
    return this.usersRepo.find();
  }

  /**
   * Email adresine göre kullanıcı bul
   * @param email - Aranacak email
   * @returns Kullanıcı nesnesi veya null
   */
  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  /**
   * ID'ye göre kullanıcı bul
   * @param id - Kullanıcı ID'si
   * @returns Kullanıcı nesnesi veya null
   */
  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  /**
   * Kullanıcıyı sil
   * @param id - Silinecek kullanıcının ID'si
   * @returns Silme işlemi başarılı mı
   */
  async remove(id: number) {
    await this.usersRepo.delete(id);
    return { deleted: true };
  }
}

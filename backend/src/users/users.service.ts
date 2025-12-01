import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleNames } from '../common/enums/role-names.enum';

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
    const buyerRole = await this.rolesRepo.findOne({ where: { name: RoleNames.BUYER } });
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
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }
    
    await this.usersRepo.delete(id);
    return { deleted: true };
  }

  /**
   * Kullanıcı bilgilerini güncelle
   * @param id - Güncellenecek kullanıcı ID'si
   * @param dto - Güncelleme DTO'su
   * @param user - İsteği yapan kullanıcı (yetki kontrolü için)
   * @returns Güncellenen kullanıcı
   */
  async update(id: number, dto: UpdateUserDto, user?: any) {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }

    // Sadece kendi profilini güncelleyebilir veya admin güncelleyebilir
    if (user && existingUser.id !== user.sub && !user.roles?.includes(RoleNames.ADMIN)) {
      throw new ForbiddenException('Sadece kendi profilinizi güncelleyebilirsiniz');
    }

    // Email benzersizlik kontrolü
    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.findByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException('Bu email adresi zaten kullanılıyor');
      }
    }

    // Username benzersizlik kontrolü
    if (dto.username && dto.username !== existingUser.username) {
      const usernameExists = await this.usersRepo.findOne({
        where: { username: dto.username },
      });
      if (usernameExists) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    // Şifre güncellemesi
    if (dto.password) {
      if (dto.password.length < 6) {
        throw new BadRequestException('Şifre minimum 6 karakter olmalıdır');
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.usersRepo.update(id, {
        ...dto,
        passwordHash: hashedPassword,
      });
    } else {
      await this.usersRepo.update(id, dto);
    }

    return this.findOne(id);
  }
}

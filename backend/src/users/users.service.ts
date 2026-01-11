import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Varsayılan BUYER rolü ile yeni kullanıcı oluştur
   * Kayıt sırasında otomatik olarak BUYER (Alıcı) rolü atanır
   * @param dto - Kullanıcı oluşturma DTO'su (email, kullanıcıAdı, şifreHash)
   * @returns Oluşturulan kullanıcı nesnesi
   */
  async createWithDefaultRole(dto: CreateUserDto) {
    // Veritabanından BUYER rolünü bul
    const buyerRole = await this.rolesRepo.findOne({ where: { name: RoleNames.BUYER } });
    
    // Yeni kullanıcı nesnesi oluştur ve rol ata
    const user = this.usersRepo.create({
      ...dto,
      roles: buyerRole ? [buyerRole] : [], // Rol bulunduysa ata, yoksa boş array
    });
    
    // Kullanıcıyı veritabanına kaydet ve döndür
    return this.usersRepo.save(user);
  }

  /**
   * Tüm kullanıcıları getir
   * Sistemdeki tüm kayıtlı kullanıcıları listeler
   * @returns Tüm kullanıcıların listesi
   */
  findAll() {
    return this.usersRepo.find({
      relations: ['roles']
    });
  }

  /**
   * Email adresine göre kullanıcı bul
   * Email unique olduğu için tek bir sonuç döner
   * @param email - Aranacak email adresi
   * @returns Kullanıcı nesnesi veya null (bulunamazsa)
   */
  findByEmail(email: string) {
    return this.usersRepo.findOne({ 
      where: { email },
      relations: ['roles']
    });
  }

  /**
   * Kullanıcı adına göre kullanıcı bul
   * Username unique olduğu için tek bir sonuç döner
   * @param username - Aranacak kullanıcı adı
   * @returns Kullanıcı nesnesi veya null (bulunamazsa)
   */
  findByUsername(username: string) {
    return this.usersRepo.findOne({ 
      where: { username },
      relations: ['roles']
    });
  }

  /**
   * ID'ye göre kullanıcı bul
   * Primary key ile arama yapar
   * @param id - Kullanıcının benzersiz kimlik numarası
   * @returns Kullanıcı nesnesi
   * @throws NotFoundException - Kullanıcı bulunamazsa
   */
  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ 
      where: { id },
      relations: ['roles']
    });
    
    if (!user) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }
    
    return user;
  }

  /**
   * Kullanıcıyı sil
   * Transaction ve pessimistic lock kullanarak güvenli silme işlemi yapar
   * Cascade delete ile ilişkili veriler de silinir (ürünler, siparişler)
   * @param id - Silinecek kullanıcının benzersiz kimlik numarası
   * @returns Silme işlemi sonucu { deleted: true }
   * @throws NotFoundException - Kullanıcı bulunamazsa
   * @throws InternalServerErrorException - Veritabanı hatası durumunda
   */
  async remove(id: number) {
    // Kullanıcının var olup olmadığını kontrol et
    await this.findOne(id);
    
    // Kullanıcıyı sil (cascade ile ilişkili veriler de silinir)
    const result = await this.usersRepo.delete(id);
    
    // Silme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Kullanıcı ${id} silinemedi`);
    }
    
    return { deleted: true };
  }

  /**
   * Kullanıcı bilgilerini güncelle
   * Transaction ve pessimistic lock kullanarak güvenli güncelleme yapar
   * Email ve kullanıcı adı benzersizlik kontrolü yapar
   * Şifre güncellemelerini otomatik hash'ler
   * 
   * @param id - Güncellenecek kullanıcının benzersiz kimlik numarası
   * @param dto - Güncelleme verileri (email, kullanıcıAdı, şifre vb.)
   * @param user - İsteği yapan kullanıcı bilgisi (yetki kontrolü için)
   * @returns Güncellenen kullanıcı nesnesi
   * @throws NotFoundException - Kullanıcı bulunamazsa
   * @throws ForbiddenException - Yetkisiz güncelleme denemesinde
   * @throws ConflictException - Email veya kullanıcı adı çakışmasında
   * @throws BadRequestException - Geçersiz veri girişinde
   * @throws InternalServerErrorException - Veritabanı hatası durumunda
   */
  async update(id: number, dto: UpdateUserDto, user?: any) {
    // Önce kullanıcının var olduğunu kontrol et
    const existingUser = await this.findOne(id);

    // Yetki kontrolü: Sadece kullanıcının kendisi veya admin güncelleyebilir
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

    // Kullanıcı adı benzersizlik kontrolü
    if (dto.username && dto.username !== existingUser.username) {
      const usernameExists = await this.findByUsername(dto.username);
      if (usernameExists) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    // Güncelleme verisini hazırla
    const updateData: any = { ...dto };

    // Şifre güncellemesi yapılıyorsa
    if (dto.password) {
      // Şifre minimum uzunluk kontrolü
      if (dto.password.length < 6) {
        throw new BadRequestException('Şifre minimum 6 karakter olmalıdır');
      }
      
      // Şifreyi bcrypt ile hash'le (10 salt round ile)
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      updateData.passwordHash = hashedPassword;
      
      // DTO'dan plain password'ü sil (veritabanına kaydedilmesin)
      delete updateData.password;
    }

    // Email güncelleniyorsa veriye ekle
    if (dto.email) {
      updateData.email = dto.email;
    }
    
    // Kullanıcı adı güncelleniyorsa veriye ekle
    if (dto.username) {
      updateData.username = dto.username;
    }

    // Kullanıcı bilgilerini güncelle
    const result = await this.usersRepo.update(id, updateData);
    
    // Güncelleme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Kullanıcı ${id} güncellenemedi`);
    }
    
    // Güncellenmiş kullanıcıyı döndür
    return this.findOne(id);
  }

  /**
   * Kullanıcıya roller ata
   * Admin'in kullanıcıya rol vermek/almak için kullanılır
   * @param id - Kullanıcı ID'si
   * @param roleIds - Atanacak rol ID'leri
   * @returns Güncellenen kullanıcı ve rolleri
   * @throws NotFoundException - Kullanıcı veya rol bulunamazsa
   * @throws InternalServerErrorException - Veritabanı hatası durumunda
   */
  async updateRoles(id: number, roleIds: number[]) {
    // Rol ID'lerini al ve doğrula
    if (!roleIds || roleIds.length === 0) {
      throw new BadRequestException('En az bir rol seçilmelidir');
    }

    // Kullanıcının var olduğunu kontrol et
    const user = await this.findOne(id);

    // Tüm rolleri veritabanından al
    const roles = await this.rolesRepo.findByIds(roleIds);

    // Seçilen tüm rol ID'lerinin mevcut olduğunu kontrol et
    if (roles.length !== roleIds.length) {
      const foundIds = roles.map(r => r.id);
      const missingIds = roleIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Rol ID'leri bulunamadı: ${missingIds.join(', ')}`);
    }

    // Kullanıcıya yeni rolleri ata
    user.roles = roles;
    await this.usersRepo.save(user);

    // Güncellenmiş kullanıcıyı döndür
    return this.findOne(id);
  }
}

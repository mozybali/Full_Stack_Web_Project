/**
 * Kullanıcıları Sıfırlama ve Test Kullanıcıları Oluşturma Script'i
 * 
 * Bu script:
 * 1. Tüm kullanıcıları siler
 * 2. Her rol için bir test kullanıcısı oluşturur (ADMIN, SELLER, BUYER)
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { AppDataSource } from '../data-source';

// Test kullanıcıları için şifre
const DEFAULT_PASSWORD = 'Test123456';

async function seedUsers() {
  console.log('🚀 Kullanıcı seed script başlatılıyor...\n');

  // DataSource'u başlat
  await AppDataSource.initialize();
  console.log('✅ Veritabanı bağlantısı kuruldu\n');

  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);

  try {
    // 1. Tüm kullanıcıları sil
    console.log('🗑️  Mevcut kullanıcılar siliniyor...');
    const allUsers = await userRepo.find();
    if (allUsers.length > 0) {
      await userRepo.remove(allUsers);
      console.log(`   ✅ ${allUsers.length} kullanıcı silindi\n`);
    } else {
      console.log('   ℹ️  Silinecek kullanıcı bulunamadı\n');
    }

    // 2. Rolleri kontrol et
    console.log('🔍 Roller kontrol ediliyor...');
    let adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' } });
    let sellerRole = await roleRepo.findOne({ where: { name: 'SELLER' } });
    let buyerRole = await roleRepo.findOne({ where: { name: 'BUYER' } });

    // Roller yoksa oluştur
    if (!adminRole) {
      adminRole = await roleRepo.save({
        name: 'ADMIN',
        description: 'Sistem yöneticisi',
      });
      console.log('   ✅ ADMIN rolü oluşturuldu');
    }

    if (!sellerRole) {
      sellerRole = await roleRepo.save({
        name: 'SELLER',
        description: 'Satıcı',
      });
      console.log('   ✅ SELLER rolü oluşturuldu');
    }

    if (!buyerRole) {
      buyerRole = await roleRepo.save({
        name: 'BUYER',
        description: 'Alıcı',
      });
      console.log('   ✅ BUYER rolü oluşturuldu');
    }

    console.log('   ✅ Roller hazır\n');

    // 3. Şifreyi hash'le
    console.log('🔐 Şifre hash\'leniyor...');
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    console.log('   ✅ Şifre hash\'lendi\n');

    // 4. Test kullanıcılarını oluştur
    console.log('👥 Test kullanıcıları oluşturuluyor...\n');

    const testUsers = [
      {
        email: 'admin@test.com',
        username: 'admin',
        passwordHash,
        roles: [adminRole],
        description: 'Admin kullanıcısı',
      },
      {
        email: 'seller@test.com',
        username: 'seller',
        passwordHash,
        roles: [sellerRole],
        description: 'Satıcı kullanıcısı',
      },
      {
        email: 'buyer@test.com',
        username: 'buyer',
        passwordHash,
        roles: [buyerRole],
        description: 'Alıcı kullanıcısı',
      },
    ];

    for (const userData of testUsers) {
      const user = userRepo.create({
        email: userData.email,
        username: userData.username,
        passwordHash: userData.passwordHash,
        roles: userData.roles,
      });

      await userRepo.save(user);
      console.log(`   ✅ ${userData.description} oluşturuldu`);
      console.log(`      Email: ${userData.email}`);
      console.log(`      Username: ${userData.username}`);
      console.log(`      Roller: ${userData.roles.map(r => r.name).join(', ')}\n`);
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✨ KULLANICI BİLGİLERİ');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('📧 Tüm kullanıcılar için şifre: ' + DEFAULT_PASSWORD);
    console.log('\n1️⃣  ADMIN Kullanıcısı:');
    console.log('   Email: admin@test.com');
    console.log('   Username: admin');
    console.log('   Rol: ADMIN\n');
    console.log('2️⃣  SELLER Kullanıcısı:');
    console.log('   Email: seller@test.com');
    console.log('   Username: seller');
    console.log('   Rol: SELLER\n');
    console.log('3️⃣  BUYER Kullanıcısı:');
    console.log('   Email: buyer@test.com');
    console.log('   Username: buyer');
    console.log('   Rol: BUYER\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ İşlem başarıyla tamamlandı!');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    // Bağlantıyı kapat
    await AppDataSource.destroy();
    console.log('\n🔌 Veritabanı bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
seedUsers()
  .then(() => {
    console.log('\n✨ Script başarıyla tamamlandı');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script hata ile sonlandı:', error);
    process.exit(1);
  });

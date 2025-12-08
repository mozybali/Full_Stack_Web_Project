/**
 * Kullanıcı Seed Script
 * Tüm kullanıcıları siler ve 3 farklı rolde yeni kullanıcılar oluşturur
 * 
 * Kullanım:
 * npx ts-node -r tsconfig-paths/register src/scripts/seed-users.ts
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

async function seedUsers() {
  let dataSource: DataSource | undefined;

  try {
    // Veritabanına bağlan
    console.log('📡 Veritabanına bağlanılıyor...');
    dataSource = await AppDataSource.initialize();
    console.log('✅ Veritabanı bağlantısı başarılı\n');

    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);

    // 1. Tüm kullanıcıları sil
    console.log('🗑️  Mevcut kullanıcılar siliniyor...');
    await dataSource.query('DELETE FROM user_roles');
    await dataSource.query('DELETE FROM users');
    console.log('✅ Tüm kullanıcılar silindi\n');

    // 2. Rolleri al
    console.log('📋 Roller yükleniyor...');
    const adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' } });
    const sellerRole = await roleRepo.findOne({ where: { name: 'SELLER' } });
    const buyerRole = await roleRepo.findOne({ where: { name: 'BUYER' } });

    if (!adminRole || !sellerRole || !buyerRole) {
      throw new Error('Roller bulunamadı! Önce migration çalıştırın.');
    }
    console.log('✅ Roller yüklendi\n');

    // 3. Şifreleri hashle
    console.log('🔐 Şifreler hazırlanıyor...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('✅ Şifreler hazır\n');

    // 4. Admin kullanıcıları oluştur
    console.log('👑 Admin kullanıcıları oluşturuluyor...');
    const admins = [
      {
        email: 'admin@gamermarkt.com',
        username: 'admin',
        passwordHash: hashedPassword,
        roles: [adminRole],
      },
      {
        email: 'admin2@gamermarkt.com',
        username: 'admin2',
        passwordHash: hashedPassword,
        roles: [adminRole],
      },
    ];

    for (const adminData of admins) {
      const admin = userRepo.create(adminData);
      await userRepo.save(admin);
      console.log(`  ✓ ${adminData.username} (${adminData.email})`);
    }
    console.log('✅ Admin kullanıcıları oluşturuldu\n');

    // 5. Seller kullanıcıları oluştur
    console.log('🏪 Seller kullanıcıları oluşturuluyor...');
    const sellers = [
      {
        email: 'seller1@gamermarkt.com',
        username: 'seller1',
        passwordHash: hashedPassword,
        roles: [sellerRole],
      },
      {
        email: 'seller2@gamermarkt.com',
        username: 'seller2',
        passwordHash: hashedPassword,
        roles: [sellerRole],
      },
      {
        email: 'seller3@gamermarkt.com',
        username: 'seller3',
        passwordHash: hashedPassword,
        roles: [sellerRole],
      },
    ];

    for (const sellerData of sellers) {
      const seller = userRepo.create(sellerData);
      await userRepo.save(seller);
      console.log(`  ✓ ${sellerData.username} (${sellerData.email})`);
    }
    console.log('✅ Seller kullanıcıları oluşturuldu\n');

    // 6. Buyer kullanıcıları oluştur
    console.log('🛒 Buyer kullanıcıları oluşturuluyor...');
    const buyers = [
      {
        email: 'buyer1@gamermarkt.com',
        username: 'buyer1',
        passwordHash: hashedPassword,
        roles: [buyerRole],
      },
      {
        email: 'buyer2@gamermarkt.com',
        username: 'buyer2',
        passwordHash: hashedPassword,
        roles: [buyerRole],
      },
      {
        email: 'buyer3@gamermarkt.com',
        username: 'buyer3',
        passwordHash: hashedPassword,
        roles: [buyerRole],
      },
      {
        email: 'buyer4@gamermarkt.com',
        username: 'buyer4',
        passwordHash: hashedPassword,
        roles: [buyerRole],
      },
    ];

    for (const buyerData of buyers) {
      const buyer = userRepo.create(buyerData);
      await userRepo.save(buyer);
      console.log(`  ✓ ${buyerData.username} (${buyerData.email})`);
    }
    console.log('✅ Buyer kullanıcıları oluşturuldu\n');

    // 7. Özet
    console.log('═══════════════════════════════════════');
    console.log('✨ KULLANICI SEEDİNG TAMAMLANDI ✨');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Toplam: ${admins.length + sellers.length + buyers.length} kullanıcı oluşturuldu`);
    console.log(`   👑 Admin:  ${admins.length} kullanıcı`);
    console.log(`   🏪 Seller: ${sellers.length} kullanıcı`);
    console.log(`   🛒 Buyer:  ${buyers.length} kullanıcı`);
    console.log('');
    console.log('🔑 Tüm kullanıcılar için şifre: 123456');
    console.log('');
    console.log('📝 Test Hesapları:');
    console.log('   Admin:  admin@gamermarkt.com / 123456');
    console.log('   Seller: seller1@gamermarkt.com / 123456');
    console.log('   Buyer:  buyer1@gamermarkt.com / 123456');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Veritabanı bağlantısı kapatıldı');
    }
    process.exit(0);
  }
}

// Script'i çalıştır
seedUsers();

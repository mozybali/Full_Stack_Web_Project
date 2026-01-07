/**
 * Ürünleri ve Oyunları Oluşturma Script'i
 * 
 * Bu script:
 * 1. Örnek oyunlar oluşturur
 * 2. Bu oyunlar için örnek ürünler oluşturur
 */

import { AppDataSource } from '../data-source';
import { Game } from '../games/game.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { ProductType } from '../common/enums/product-type.enum';

async function seedProducts() {
  console.log('🚀 Ürün ve oyun seed script başlatılıyor...\n');

  // DataSource'u başlat
  await AppDataSource.initialize();
  console.log('✅ Veritabanı bağlantısı kuruldu\n');

  const gameRepo = AppDataSource.getRepository(Game);
  const productRepo = AppDataSource.getRepository(Product);
  const userRepo = AppDataSource.getRepository(User);

  try {
    // Satıcı kullanıcıyı bul (seller@test.com)
    console.log('🔍 Satıcı kullanıcı aranıyor...');
    let seller = await userRepo.findOne({ where: { email: 'seller@test.com' } });
    
    if (!seller) {
      console.log('❌ Satıcı kullanıcı bulunamadı! Önce seed:users scriptini çalıştırın.');
      process.exit(1);
    }
    console.log('   ✅ Satıcı kullanıcı bulundu\n');

    // Oyunları oluştur veya bul
    console.log('🎮 Oyunlar oluşturuluyor...');
    
    const gamesData = [
      { name: 'League of Legends', platform: 'PC', genre: 'MOBA' },
      { name: 'Counter-Strike 2', platform: 'PC', genre: 'FPS' },
      { name: 'Valorant', platform: 'PC', genre: 'FPS' },
      { name: 'FIFA 24', platform: 'PC, PS5, Xbox', genre: 'Sports' },
      { name: 'Grand Theft Auto V', platform: 'PC, PS5, Xbox', genre: 'Action' },
      { name: 'Minecraft', platform: 'PC, Mobile, Console', genre: 'Sandbox' },
      { name: 'Fortnite', platform: 'PC, PS5, Xbox, Mobile', genre: 'Battle Royale' },
      { name: 'Apex Legends', platform: 'PC, PS5, Xbox', genre: 'Battle Royale' },
      { name: 'Cyberpunk 2077', platform: 'PC, PS5, Xbox', genre: 'RPG' },
      { name: 'The Witcher 3', platform: 'PC, PS5, Xbox', genre: 'RPG' },
    ];

    const games: Game[] = [];
    for (const gameData of gamesData) {
      let game = await gameRepo.findOne({ where: { name: gameData.name } });
      if (!game) {
        game = await gameRepo.save(gameData);
        console.log(`   ✅ ${gameData.name} oyunu oluşturuldu`);
      } else {
        console.log(`   ℹ️  ${gameData.name} oyunu zaten mevcut`);
      }
      games.push(game);
    }
    console.log('   ✅ Tüm oyunlar hazır\n');

    // Ürünleri oluştur
    console.log('🛍️  Ürünler oluşturuluyor...');
    
    const productsData = [
      // League of Legends
      {
        title: 'League of Legends - Level 30 Hesap (50+ Champion)',
        description: 'Seviye 30 hesap, 50\'den fazla champion unlocked, ranked oynamaya hazır',
        type: ProductType.ACCOUNT,
        price: 250,
        stock: 5,
        imageUrl: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt370b35188c0e5edb/5db05fa8347d1c6baa57be25/RiotX_ChampionList_lol_logo.jpg',
        game: games[0],
        seller,
      },
      {
        title: 'League of Legends - RP Kodu 1380 RP',
        description: 'League of Legends için 1380 RP kodu, anında teslim',
        type: ProductType.KEY,
        price: 100,
        stock: 20,
        imageUrl: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt370b35188c0e5edb/5db05fa8347d1c6baa57be25/RiotX_ChampionList_lol_logo.jpg',
        game: games[0],
        seller,
      },
      // Counter-Strike 2
      {
        title: 'Counter-Strike 2 - Prime Status Hesap',
        description: 'CS2 Prime Status, Trust Factor yüksek, temiz hesap',
        type: ProductType.ACCOUNT,
        price: 180,
        stock: 3,
        imageUrl: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
        game: games[1],
        seller,
      },
      // Valorant
      {
        title: 'Valorant - Unrated Hazır Hesap',
        description: 'Valorant unrated oynamaya hazır hesap, tüm agentlar unlocked',
        type: ProductType.ACCOUNT,
        price: 150,
        stock: 8,
        imageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5c61de6e1b0a1c80/5eb7cdc0ee88132a6f6cfc2b/V_AGENTS_587x900.jpg',
        game: games[2],
        seller,
      },
      {
        title: 'Valorant - VP Kodu 1000 VP',
        description: 'Valorant için 1000 VP kodu, anında teslimat',
        type: ProductType.KEY,
        price: 80,
        stock: 15,
        imageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5c61de6e1b0a1c80/5eb7cdc0ee88132a6f6cfc2b/V_AGENTS_587x900.jpg',
        game: games[2],
        seller,
      },
      // FIFA 24
      {
        title: 'FIFA 24 - Steam Key',
        description: 'FIFA 24 PC Steam aktivasyon anahtarı, yeni hesap',
        type: ProductType.KEY,
        price: 450,
        stock: 10,
        imageUrl: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2195250/header.jpg',
        game: games[3],
        seller,
      },
      // GTA V
      {
        title: 'Grand Theft Auto V - Rockstar Key',
        description: 'GTA V Rockstar aktivasyon anahtarı, online oynamaya uygun',
        type: ProductType.KEY,
        price: 200,
        stock: 12,
        imageUrl: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
        game: games[4],
        seller,
      },
      {
        title: 'Grand Theft Auto V - Modlu Hesap (100M$)',
        description: 'GTA Online 100 milyon dolar + tüm dlc araçlar',
        type: ProductType.ACCOUNT,
        price: 350,
        stock: 4,
        imageUrl: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
        game: games[4],
        seller,
      },
      // Minecraft
      {
        title: 'Minecraft Java Edition - Premium Hesap',
        description: 'Minecraft Java Edition premium hesap, değiştirilebilir',
        type: ProductType.ACCOUNT,
        price: 120,
        stock: 15,
        imageUrl: 'https://www.minecraft.net/content/dam/games/minecraft/marketplace/mediablock-square-format/mediablock-icon.jpg',
        game: games[5],
        seller,
      },
      // Fortnite
      {
        title: 'Fortnite - 1000 V-Bucks Kodu',
        description: 'Fortnite için 1000 V-Bucks kodu, anında teslimat',
        type: ProductType.KEY,
        price: 90,
        stock: 25,
        imageUrl: 'https://cdn2.unrealengine.com/Fortnite%2Fhome%2FBP19%2FBR19_LandingPage_2048x2048-2048x2048-c8a4d77cd42d6c88e6f18fb9f5eba4c8f8ee8de8.jpg',
        game: games[6],
        seller,
      },
      // Apex Legends
      {
        title: 'Apex Legends - Level 100+ Hesap',
        description: 'Apex Legends seviye 100 üstü hesap, tüm legendler unlocked',
        type: ProductType.ACCOUNT,
        price: 280,
        stock: 6,
        imageUrl: 'https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop191x100.1200w.jpg',
        game: games[7],
        seller,
      },
      // Cyberpunk 2077
      {
        title: 'Cyberpunk 2077 - GOG Key',
        description: 'Cyberpunk 2077 GOG aktivasyon anahtarı, DRM-free',
        type: ProductType.KEY,
        price: 300,
        stock: 8,
        imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKZ4tKNFj9C00giTzYtH8PF1.png',
        game: games[8],
        seller,
      },
      // The Witcher 3
      {
        title: 'The Witcher 3: Wild Hunt GOTY - Steam Key',
        description: 'The Witcher 3 Game of the Year Edition, tüm DLC\'ler dahil',
        type: ProductType.KEY,
        price: 150,
        stock: 20,
        imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png',
        game: games[9],
        seller,
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of productsData) {
      const existingProduct = await productRepo.findOne({
        where: { title: productData.title },
      });

      if (!existingProduct) {
        await productRepo.save(productData);
        console.log(`   ✅ ${productData.title} oluşturuldu`);
        createdCount++;
      } else {
        console.log(`   ℹ️  ${productData.title} zaten mevcut`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Seed işlemi tamamlandı!`);
    console.log(`   📊 ${createdCount} yeni ürün oluşturuldu`);
    console.log(`   ℹ️  ${skippedCount} ürün zaten mevcuttu`);
    console.log(`   🎮 ${games.length} oyun hazır\n`);

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Veritabanı bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
seedProducts()
  .then(() => {
    console.log('✅ İşlem başarıyla tamamlandı!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ İşlem başarısız:', error);
    process.exit(1);
  });

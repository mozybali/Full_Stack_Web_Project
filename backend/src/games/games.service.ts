import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';

/**
 * Oyun yönetimi servisi
 * Oyun kataloğu oluşturma ve yönetim işlemlerini gerçekleştirir
 */
@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepo: Repository<Game>,
  ) {}

  /**
   * Tüm oyunları getir
   * @returns Oyunlar listesi
   */
  findAll() {
    return this.gamesRepo.find({ relations: ['products'] });
  }

  /**
   * ID'ye göre oyun bul
   * @param id - Oyun ID'si
   * @returns Oyun detayları
   * @throws NotFoundException - Oyun bulunamazsa
   */
  async findOne(id: number) {
    const game = await this.gamesRepo.findOne({ where: { id }, relations: ['products'] });
    
    if (!game) {
      throw new NotFoundException(`Oyun ${id} bulunamadı`);
    }
    
    return game;
  }

  /**
   * Yeni oyun oluştur
   * @param dto - Oyun oluşturma DTO'su
   * @returns Oluşturulan oyun
   */
  create(dto: CreateGameDto) {
    const game = this.gamesRepo.create(dto);
    return this.gamesRepo.save(game);
  }

  /**
   * Oyun bilgilerini güncelle
   * @param id - Oyun ID'si
   * @param dto - Oyun güncelleme DTO'su
   * @returns Güncellenen oyun
   */
  async update(id: number, dto: UpdateGameDto) {
    const result = await this.gamesRepo.update(id, dto);
    
    // Güncelleme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Oyun ${id} bulunamadı veya güncellenemedi`);
    }
    
    return this.findOne(id);
  }

  /**
   * Oyunu sil
   * @param id - Silinecek oyun ID'si
   * @returns Silme işlemi başarılı mı
   */
  async remove(id: number) {
    const result = await this.gamesRepo.delete(id);
    
    // Silme sonucunu kontrol et
    if (result.affected === 0) {
      throw new NotFoundException(`Oyun ${id} bulunamadı veya silinemedi`);
    }
    
    return { deleted: true };
  }
}

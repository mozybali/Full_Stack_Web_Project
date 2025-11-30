import { Injectable } from '@nestjs/common';
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
   */
  findOne(id: number) {
    return this.gamesRepo.findOne({ where: { id }, relations: ['products'] });
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
    await this.gamesRepo.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Oyunu sil
   * @param id - Silinecek oyun ID'si
   * @returns Silme işlemi başarılı mı
   */
  async remove(id: number) {
    await this.gamesRepo.delete(id);
    return { deleted: true };
  }
}

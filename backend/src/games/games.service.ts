import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepo: Repository<Game>,
  ) {}

  findAll() {
    return this.gamesRepo.find({ relations: ['products'] });
  }

  findOne(id: number) {
    return this.gamesRepo.findOne({ where: { id }, relations: ['products'] });
  }

  create(dto: CreateGameDto) {
    const game = this.gamesRepo.create(dto);
    return this.gamesRepo.save(game);
  }

  async update(id: number, dto: UpdateGameDto) {
    await this.gamesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.gamesRepo.delete(id);
    return { deleted: true };
  }
}

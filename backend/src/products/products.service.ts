import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepo.find({
      relations: ['seller', 'game'],
    });
  }

  findOne(id: number) {
    return this.productsRepo.findOne({
      where: { id },
      relations: ['seller', 'game'],
    });
  }

  create(dto: CreateProductDto, sellerId: number) {
    const product = this.productsRepo.create({
      ...dto,
      seller: { id: sellerId },
      game: { id: dto.gameId },
    });
    return this.productsRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.productsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productsRepo.delete(id);
    return { deleted: true };
  }
}

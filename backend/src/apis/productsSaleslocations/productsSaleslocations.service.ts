import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSaleslocation } from './entities/productSaleslocation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsSaleslocationsService {
  constructor(
    @InjectRepository(ProductSaleslocation)
    private readonly productsSaleslocationsRepository: Repository<ProductSaleslocation>,
  ) {}
  create({ productSaleslocation }) {
    return this.productsSaleslocationsRepository.save({
      ...productSaleslocation,
    });
  }
}

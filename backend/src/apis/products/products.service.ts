import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { IProductsServiceCreate } from './interfaces/products-service.interface';
import { IProductsServiceFindOne } from './interfaces/products-service.interface';
import { UpdateProductInput } from './dto/update-product.input';
import { IProductServiceUpdate } from './interfaces/products-service.interface';
import { IProductsServiceCheckSoldOut } from './interfaces/products-service.interface';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';
import { ProductsTagsService } from '../productsTags/entities/productsTags.service';

@Injectable({})
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //

    private readonly productsSaleslocationService: ProductsSaleslocationsService,

    private readonly productsTagsService: ProductsTagsService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    // 상품 하나만 등록할 때 사용하는 방법
    // const result = this.productsRepository.save({
    //   ...createProductInput,
    // });

    // 상품과 상품거래위치를 같이 등록하는 방법
    const { productSaleslocation, productCategoryId, productTags, ...product } =
      createProductInput;

    // 서비스를 타고 가야함
    // 레파지토리에 직접 접근하면 검증로직 통일시킬 수 없음..

    // 상품거래위치 등록
    const result = await this.productsSaleslocationService.create({
      productSaleslocation,
    });

    // 상품태그 등록
    // productTags가 ["#전자제품", "#영등포", "#컴퓨터"] 와 같은 패턴이라고 가정

    const tagNames = productTags.map((el) => el.replace('#', '')); // ["전자제품", "영등포", "컴퓨터"]
    const prevTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = [];
    tagNames.forEach((el) => {
      const isExists = prevTags.find((prevEl) => el === prevEl.name);
      if (!isExists) {
        temp.push({ name: el });
      }
    });

    const newTags = await this.productsTagsService.bulkInsert({ names: temp });
    const tags = [...prevTags, ...newTags.identifiers];

    const result2 = this.productsRepository.save({
      ...product,
      productSaleslocation: result,
      productCategory: {
        id: productCategoryId,
        //
      },
      productTags: tags,
    });
    return result2;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductServiceUpdate): Promise<void> {
    // 기존 코드 재사용하여 로직 통일
    const product = await this.findOne({ productId });

    // 검증은 서비스에서 해야 함.
    this.checkSoldout({ product });

    // this.productsRepository.insert()
    // this.productsRepository.update()
    // 는 db에 저장하고 리턴하지 않음.

    // 숙제.왜 에러나는지 파악하고 수정해보기
    // const result = this.productsRepository.save({
    //   ...product,
    //   ...updateProductInput,
    // });
    // return result;
  }

  checkSoldout({ product }: IProductsServiceCheckSoldOut): void {
    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    }

    // if (product.isSoldout) {
    //   throw new HttpException(
    //     '이미 판매 완료된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }

  async delete({ productId }: IProductServiceDelete) {
    // const result = await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    // const result = await this.productsRepository.softRemove({ id: productId });
    // softRemove 특징
    // id로밖에 지울 수 없음 name: 철수로 지울 수 없음
    // 한 번에 싹 다 지울 수 있음.
    // .softRemove({id: aaa}, {id: bbb}, {id: ccc})

    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false;
    // softDelete 특징
    // 한 번에 하나씩
    // id 뿐 아니라 다양한 컬럼으로 삭제가능
  }
}

interface IProductServiceDelete {
  productId: string;
}

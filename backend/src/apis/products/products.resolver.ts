import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    //
  ) {}

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('CreateProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    // 브라우저에 결과 보내주는 2가지 방법

    // 1. 등록된 내용이 담긴 객체를 그대로 브라우저에 보내주기
    return this.productsService.create({ createProductInput });

    // 2. 결과메세지만 간단히 보내주기
    // return "정상적으로 상품이 등록되었습니다."
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('ProductId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<void> {
    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string): Promise<boolean> {
    return this.productsService.delete({ productId });
  }
}

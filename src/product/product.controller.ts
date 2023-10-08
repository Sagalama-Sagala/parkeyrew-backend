import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { UserService } from 'src/user/user.service';
// import { updateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { createProductDto } from './dto/create-product.dto';
import { PaginationParameters } from './dto/pagination-params';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    description: 'Get product objects as response',
    type: Product,
    isArray: true,
  })
  @Get()
  async getProducts(): Promise<Product[]> {
    const products = await this.productService.findAll();
    return products;
  }

  @ApiOkResponse({
    description: 'Get product home page as response',
    type: Product,
    isArray: true,
  })
  @Get('get-home-page')
  async getProductsLatest(): Promise<Product[]> {
    const products = this.productService.findLatest();
    return products;
  }

  @ApiOkResponse({
    description: 'Get product objects as response',
    type: Product,
    isArray: true,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  @Get('get-products-by-fillter')
  async getPagination(
    @Query() getProductsParams: PaginationParameters,
  ): Promise<Product[]> {
    const products = this.productService.findByPagination(getProductsParams);
    return products;
  }

  @ApiOkResponse({
    description: 'Get info product page successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  @ApiSecurity('JWT-auth')
  @Get('get-info-product-page/:id')
  async getInfoProductPage(
    @Param('id') id: string
  ){
    return await this.productService.findInfoProductPage(id);
  }

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: createProductDto,
  })
  @ApiBadRequestResponse({
    description: 'Product cannot add. Try again',
  })
  @ApiSecurity('JWT-auth')
  @Post('create-product')
  async createProduct(@Req() req: any, @Body() product: createProductDto) {
    const userId = req.userId;
    const newProduct = await this.productService.create(product, userId);
    newProduct.owner = userId;
    return newProduct;
  }
}

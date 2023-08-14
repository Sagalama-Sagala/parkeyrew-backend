import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductService } from './product.service';
import { createProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse({
    description: 'Get product objects as response',
    type: Product,
    isArray: true,
  })
  @Get()
  async getProducts(): Promise<Product[]> {
    const products = this.productService.findAll();
    return products;
  }

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: Product,
  })
  @ApiBadRequestResponse({
    description: 'Product cannot add. Try again',
  })
  @Post()
  async createProduct(
    @Body()
    product: createProductDto,
  ): Promise<Product> {
    return this.productService.create(product);
  }

  @ApiCreatedResponse({
    description: 'Get product object as response',
    type: Product,
  })
  @ApiNotFoundResponse({
    description: 'Invalid product ID, Try again',
  })
  @Get(':id')
  async getProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.findById(id);
  }

  @ApiCreatedResponse({
    description: 'Updated product object as response',
    type: Product,
  })
  @ApiNotFoundResponse({
    description: 'Invalid product ID, Try again',
  })
  @Put(':id')
  async updateProduct(
    @Param('id')
    id: string,
    @Body()
    product: updateProductDto,
  ): Promise<Product> {
    return this.productService.updateById(id, product);
  }

  @ApiNotFoundResponse({
    description: 'Invalid product ID, Try again',
  })
  @ApiOkResponse({
    description: 'Delete OK.',
  })
  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.deleteById(id);
  }
}

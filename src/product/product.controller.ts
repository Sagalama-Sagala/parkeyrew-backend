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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    const products = this.productService.findAll();
    return products;
  }

  @Post()
  async createProduct(
    @Body()
    product: createProductDto,
  ): Promise<Product> {
    return this.productService.create(product);
  }

  @Get(':id')
  async getProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.findById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id')
    id: string,
    @Body()
    product: updateProductDto,
  ): Promise<Product> {
    return this.productService.updateById(id, product);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.deleteById(id);
  }
}

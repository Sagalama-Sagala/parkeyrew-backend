import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { createProductDto } from './dto/create-product.dto';
import { getInfoProductPageDto } from './dto/get-info-product-page.dto';
import { updateProductDto } from './dto/update-product.dto';
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
  async getHomePage(): Promise<Product[]> {
    const products = this.productService.find4Latest();
    return products;
  }

  @ApiOkResponse({
    description: 'Get product objects as response',
    type: Product,
    isArray: true,
  })
  @Get('get-products-by-fillter')
  async getPagination(): Promise<Product[]> {
    const products = this.productService.findByFilter();
    return products;
  }

  @ApiOkResponse({
    description: 'Get info product page successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiSecurity('JWT-auth')
  @Get('get-info-product-page/:id')
  async getInfoProductPage(
    @Req() req,
    @Param('id') id: string,
  ): Promise<getInfoProductPageDto> {
    return await this.productService.findInfoProductPage(id, req.userId);
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
  async createProduct(
    @Req() req: any,
    @Body() product: createProductDto,
  ): Promise<Product> {
    const userId = req.userId;
    const newProduct = await this.productService.create(product, userId);
    newProduct.owner = userId;
    return newProduct;
  }

  @ApiOkResponse({
    description: 'update product successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error to update product',
  })
  @Post('edit-product-info')
  async editProductInfo(
    @Req() req: any,
    @Body() productInfo: updateProductDto,
  ): Promise<Product> {
    return await this.productService.update(req.userId, productInfo);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  // Put,
  UseGuards,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ProductService } from './product.service';
// import { updateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createProductDto } from './dto/create-product.dto';
import { User } from 'src/decorators/user.decorator';
import { updateProductDto } from './dto/update-product.dto';

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
    type: createProductDto,
  })
  @ApiBadRequestResponse({
    description: 'Product cannot add. Try again',
  })
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @Body()
    product: createProductDto,
    @User('userId')
    userId: any,
  ): Promise<Product> {
    return this.productService.create(product, userId);
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
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.deleteById(id);
  }
}

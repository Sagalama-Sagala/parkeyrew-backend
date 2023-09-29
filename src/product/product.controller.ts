import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { UserService } from 'src/user/user.service';
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
import { createProductDto } from './dto/create-product.dto';
import { Response } from 'express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService
  ) {}

  @ApiOkResponse({
    description: 'Get product objects as response',
    type: Product,
    isArray: true,
  })
  @Get()
  async getProducts(): Promise<Product[]> {
    const products = this.productService.findAll();
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
    @Param('id') id: string,
    @Res() res: Response
  ){
    try{
      const product = await this.productService.findById(id);
      if(!product){
        res.status(404).json({
          message: 'Product not found',
          data: {productId: id},
        });
      }
      const newProduct = await this.productService.updateViewcount(id, product.viewCount+1);
      const userId = product.owner;
      const user = await this.userService.findById(userId.toString());
      const productsOfUser = await this.productService.findTop4ProductsOfUser(userId.toString(), id);
      productsOfUser.sort((a,b) => b.viewCount-a.viewCount);
      const topProductsOfUser=productsOfUser.slice(0,4);
      res.status(200).json({
        message: 'Get info product page successfully',
        data: {
          product: newProduct,
          user: {
            username: user.username,
            reviewStar: user.reviewStar
          },
          productsOfUser: topProductsOfUser
        },
      })
    }
    catch(err){
      res.status(500).json({
        message: "Error to get info product page",
        data: err.message
      });
    }
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
    @Req() req:any,
    @Body() product: createProductDto,
  ){
    const userId = req.userId;
    const newProduct = await this.productService.create(product, userId);
    newProduct.owner = userId;
    return newProduct;
  }
}

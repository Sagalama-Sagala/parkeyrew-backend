import { InjectModel } from '@nestjs/mongoose';
import { forwardRef } from '@nestjs/common';
import mongoose from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Product } from 'src/product/schemas/product.schema';
import { PaginationParameters } from 'src/product/dto/pagination-params';
import { createProductDto } from 'src/product/dto/create-product.dto';
import { updateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: mongoose.Model<Product>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findAll(): Promise<Product[]> {
    const product = await this.ProductModel.find()
      .populate('owner')
      .populate('category');
    return product;
  }

  async findLatest(): Promise<Product[] | undefined> {
    const products = await this.ProductModel.find().sort({ _id: -1 }).limit(4);
    return products;
  }

  async findByPagination(
    paginationParams: PaginationParameters,
  ): Promise<Product[] | undefined> {
    const products = await this.ProductModel.find(
      {},
      {},
      {
        lean: true,
        sort: {
          createdAt: -1,
        },
        ...paginationParams,
      },
    );
    return products;
  }

  async findAllByOwnerId(userId: string): Promise<Product[]> {
    const products = await this.ProductModel.find({ owner: userId });
    return products;
  }

  async findTop4ProductsOfUser(userId: string, productId: string) {
    const products = await this.ProductModel.find({
      owner: userId,
      _id: { $ne: productId },
    });
    return products;
  }

  async create(product: createProductDto, userId: string): Promise<Product> {
    try {
      const user = await this.userService.findById(userId);
      const newProduct = await this.ProductModel.create({
        ...product,
        owner: user,
      });
      return newProduct;
    } catch (error) {
      throw new HttpException(
        'Can not create product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<Product> {
    const user = await this.ProductModel.findById(id);
    return user;
  }

  async updateById(id: string, product: updateUserDto): Promise<Product> {
    try {
      return await this.ProductModel.findOneAndUpdate({ _id: id }, product, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateViewcount(id: string, viewCount: number) {
    try {
      return await this.ProductModel.findOneAndUpdate(
        { _id: id },
        { $set: { viewCount: viewCount } },
        { new: true, runValidators: true },
      );
    } catch (err) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async deleteById(id: string): Promise<Product> {
    return await this.ProductModel.findByIdAndDelete(id);
  }
}

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createProductDto } from './dto/create-product.dto';
import { UserService } from 'src/user/user.service';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProuctModel: mongoose.Model<Product>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Product[]> {
    const product = await this.ProuctModel.find();
    return product;
  }

  async create(product: createProductDto, userId: string): Promise<Product> {
    try {
      const user = await this.userService.findById(userId);
      const newProduct = this.ProuctModel.create({
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
    try {
      const user = await this.ProuctModel.findById(id);
      return user;
    } catch (error) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateById(id: string, product: updateProductDto): Promise<Product> {
    try {
      return await this.ProuctModel.findOneAndUpdate({ _id: id }, product, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async deleteById(id: string): Promise<Product> {
    return await this.ProuctModel.findByIdAndDelete(id);
  }
}

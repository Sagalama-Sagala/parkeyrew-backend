import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProuctModel: mongoose.Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    const product = await this.ProuctModel.find();
    return product;
  }

  async create(product: Product): Promise<Product> {
    const res = await this.ProuctModel.create(product);
    return res;
  }

  async findById(id: string): Promise<Product> {
    try {
      const user = await this.ProuctModel.findById(id);
      return user;
    } catch (error) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateById(id: string, product: Product): Promise<Product> {
    try {
      return await this.ProuctModel.findOneAndUpdate({ _id: id }, product, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async deleteById(id: string): Promise<Product> {
    return await this.ProuctModel.findByIdAndDelete(id);
  }
}

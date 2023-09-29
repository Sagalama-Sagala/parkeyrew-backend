import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { createProductDto } from './dto/create-product.dto';
import { UserService } from 'src/user/user.service';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: mongoose.Model<Product>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Product[]> {
    const product = await this.ProductModel.find();
    return product;
  }

  async findAllByOwnerId(userId: string): Promise<Product[]> {
    const products = await this.ProductModel.find({ owner: userId });
    return products;
  }

  async findTop4ProductsOfUser(userId: string,productId: string){
    const products = await this.ProductModel.find({ owner:userId, _id: { $ne : productId} });
    return products;
  }

  async create(product: createProductDto, userId: string): Promise<Product> {
    try {
      const user = await this.userService.findById(userId);
      const newProduct = this.ProductModel.create({
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

  async updateById(id: string, product: updateProductDto): Promise<Product> {
    try {
      return await this.ProductModel.findOneAndUpdate({ _id: id }, product, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateViewcount(id: string,viewCount: number){
    try{
      return await this.ProductModel.findOneAndUpdate(
        { _id: id },
        { $set: { viewCount: viewCount} },
        { new: true, runValidators: true }
      );
    }
    catch (err){
      throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
    }
  }

  async deleteById(id: string): Promise<Product> {
    return await this.ProductModel.findByIdAndDelete(id);
  }
}

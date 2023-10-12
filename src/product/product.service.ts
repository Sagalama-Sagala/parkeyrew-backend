import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Product } from 'src/product/schemas/product.schema';
import { createProductDto } from 'src/product/dto/create-product.dto';
import { getInfoProductPageDto } from './dto/get-info-product-page.dto';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: mongoose.Model<Product>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findAll(): Promise<Product[]> {
    const product = await this.ProductModel.find().populate('owner');
    return product;
  }

  async find4Latest(): Promise<Product[]> {
    return await this.ProductModel.find().sort({ createdAt: -1 }).limit(4);
  }

  async findByFilter(): Promise<Product[] | undefined> {
    const products = await this.ProductModel
      .find
      //filter
      ()
      .sort({ createdAt: -1 });
    return products;
  }

  async findAllByOwnerId(userId: string): Promise<Product[]> {
    const products = await this.ProductModel.find({ owner: userId });
    return products;
  }

  async findById(id: string): Promise<Product> {
    const user = await this.ProductModel.findById(id);
    return user;
  }

  async findInfoProductPage(productId: string): Promise<any> {
    try {
      const product = await this.ProductModel.findById(productId);
      const newProduct = await this.ProductModel.findOneAndUpdate(
        { _id: productId },
        { $set: { viewCount: product.viewCount + 1 } },
        { new: true, runValidators: true },
      ).populate({ path: 'owner', select: 'username reviewStar' });
      const productsOfUser = await this.ProductModel.find({
        _id: { $ne: productId },
      })
        .populate({ path: 'owner', select: 'username reviewStar' })
        .sort({ createAt: -1 })
        .limit(4);
      const result = new getInfoProductPageDto();
      result.product = newProduct;
      result.productsOfUser = productsOfUser;
      return result;
    } catch (err) {
      throw new HttpException(
        'Error to get info product page: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async update(ownerId: string, product: updateProductDto): Promise<Product> {
    try {
      const newProduct = await this.ProductModel.findOneAndUpdate(
        { _id: product.productId, owner: ownerId },
        { $set: product }, 
        { new: true, runValidators: true }
      );
      if(!newProduct){
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      return newProduct;
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

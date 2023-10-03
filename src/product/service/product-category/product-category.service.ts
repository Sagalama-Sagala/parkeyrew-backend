import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { createProductCategoryDto } from 'src/product/dto/create-product-category.dto';
import { ProductCategory } from 'src/product/schemas/product-category.schema';
import { Product } from 'src/product/schemas/product.schema';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private ProductCategoryModel: mongoose.Model<ProductCategory>,
  ) {}

  async create(
    productCategory: createProductCategoryDto,
  ): Promise<ProductCategory> {
    return await this.ProductCategoryModel.create(productCategory);
  }

  async findByName(name: string): Promise<ProductCategory> {
    return await this.ProductCategoryModel.findOne({ name: name });
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.ProductCategoryModel.find();
  }

  async addProductToProductCategory(
    productCategory: ProductCategory,
    product: Product,
  ): Promise<ProductCategory> {
    const newProductCategory =
      await this.ProductCategoryModel.findByIdAndUpdate(productCategory._id, {
        $push: { products: product._id },
      });
    return newProductCategory;
  }
}

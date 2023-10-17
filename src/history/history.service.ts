import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { History } from './schema/history.schema';
import mongoose from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';
import { Review } from 'src/review/schemas/review.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name)
    private HistoryModel: mongoose.Model<History>,
  ) {}

  async findByShop(userId: string): Promise<History[]> {
    return await this.HistoryModel.find({ shop: userId })
      // .populate({ path: "product", select: "name price deliveryFee" })
      .populate({ path: 'product' })
      .populate({ path: 'customer', select: '-password' })
      .populate('review');
  }

  async findByCustomer(userId: string): Promise<History[]> {
    const res = await this.HistoryModel.find({ customer: userId })
      .populate({ path: 'product' })
      .populate({ path: 'shop', select: '-password' })
      .populate('review');
    console.log(res);
    return res;
  }

  async create(product: Product, shop: User, customer: User): Promise<any> {
    try {
      return await this.HistoryModel.create({
        product: product,
        shop: shop,
        customer: customer,
      });
    } catch (err) {
      throw new HttpException(
        'Error to creating History: ' + err.message,
        err.status,
      );
    }
  }

  async updateStatus(historyId: string, status: string): Promise<History> {
    try {
      const history: History = await this.HistoryModel.findOneAndUpdate(
        { _id: historyId },
        { $set: { status: status } },
        { new: true, runValidators: true },
      );
      return history;
    } catch (err) {
      throw new HttpException(
        'Error to updating History: ' + err.message,
        err.status,
      );
    }
  }

  async addReview(review: Review, historyId: string): Promise<History> {
    try {
      return await this.HistoryModel.findByIdAndUpdate(
        { _id: historyId },
        { $set: { review: review } },
        { new: true, runValidators: true },
      );
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}

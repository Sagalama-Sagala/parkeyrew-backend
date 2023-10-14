import { InjectModel } from "@nestjs/mongoose";
import { HttpException, Injectable } from "@nestjs/common";
import { History } from "./schema/history.schema";
import mongoose from "mongoose";
import { Product } from "src/product/schemas/product.schema";
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name)
        private HistoryModel: mongoose.Model<History>,
    ){}

    async create(product: Product, shop: User, customer: User): Promise<any>{
        try{
            return await this.HistoryModel.create({
                product: product,
                shop: shop,
                customer: customer,
            });
        }
        catch(err){
            throw new HttpException('Error to creating History: '+err.message,err.status);
        }
    }

    async updateStatus(historyId: string, status: string): Promise<History>{
        try{
            const history: History = await this.HistoryModel.findOneAndUpdate(
                { _id: historyId },
                { $set: { status: status } },
                { new: true, runValidators: true },
            )
            return history
        }
        catch(err){
            throw new HttpException('Error to updating History: '+err.message,err.status);
        }
    }
}
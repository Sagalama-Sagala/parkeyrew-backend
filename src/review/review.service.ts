import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./schemas/review.schema";
import mongoose from "mongoose";
import { createReviewDto } from "./dto/create-review.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class ReviewService{
    constructor(
        @InjectModel(Review.name)
        private ReviewModel: mongoose.Model<Review>,
        private readonly userService: UserService,
    ){}

    // async findAllByShopId(shopId: string): Promise<Review[]>{
    //     try{
    //         return await this.ReviewModel.find({shopId: shopId});//.sort({ createAt: -1 })
    //     }
    //     catch(err){
    //         throw new HttpException('Error while get all reviews: '+err.message,HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async create(userId: string, review: createReviewDto): Promise<Review>{
        try{
            if(userId==review.shop){
                throw new HttpException('Cannot review for yourself',HttpStatus.BAD_REQUEST);
            }
            const customer = await this.userService.findById(userId);
            const shop = await this.userService.updateReviewStar(review.shop,review.reviewStar);
            return await this.ReviewModel.create({
                customer: customer,
                shop: shop,
                reviewStar: review.reviewStar,
                text: review.text,
            });
        }
        catch(err){
            throw new HttpException('Error to crate review: '+err.message,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
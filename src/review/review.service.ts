import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./schemas/review.schema";
import mongoose from "mongoose";

@Injectable()
export class ReviewService{
    constructor(
        @InjectModel(Review.name)
        private ReviewModel: mongoose.Model<Review>,
    ){}
}
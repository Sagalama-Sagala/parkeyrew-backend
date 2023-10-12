import { Module } from '@nestjs/common';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose'; 

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
})

export class ReviewModule {}
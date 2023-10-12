import { Module } from '@nestjs/common';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose'; 
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
        UserModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
})

export class ReviewModule {}
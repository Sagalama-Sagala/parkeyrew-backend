import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Review } from './schemas/review.schema';
import { createReviewDto } from './dto/create-review.dto';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOkResponse({
    description: 'Get review by userId successfully',
  })
  @Get('get-review-by-userId')
  async getReviewByUserId(@Req() req: any): Promise<Review[]> {
    return await this.reviewService.findAllByShopId(req.userId);
  }

  @ApiOkResponse({
    description: 'Get review by shopId successfully',
  })
  @Get('get-review-by-shopId/:id')
  async getReviewByShopId(@Param('id') id: string): Promise<Review[]> {
    return await this.reviewService.findAllByShopId(id);
  }

  @ApiCreatedResponse({
    description: 'Create review by userId successfully',
    type: Review,
  })
  @ApiBadRequestResponse({
    description: 'Cannot create review. Try again',
  })
  @Post('create-review')
  async createReview(
    @Req() req: any,
    @Body() review: createReviewDto,
  ): Promise<Review> {
    const newReview = await this.reviewService.create(req.userId, review);
    newReview.shop.password = '';
    newReview.customer.password = '';
    return newReview;
  }
}

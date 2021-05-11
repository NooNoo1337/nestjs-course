import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

type DT<T> = DocumentType<T>;

type DeletionResponse = {
  ok?: number;
  n?: number;
} & {
  deletedCount?: number;
};

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: ModelType<ReviewModel>,
  ) {}

  async create(newReviewDto: CreateReviewDto): Promise<DT<ReviewModel>> {
    return this.reviewModel.create(newReviewDto);
  }

  async delete(id: string): Promise<DT<ReviewModel> | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<DT<ReviewModel>[]> {
    return this.reviewModel
      .find({ productId: Types.ObjectId(productId) })
      .exec();
  }

  async deleteAllByProductId(productId: string): Promise<DeletionResponse> {
    return this.reviewModel
      .deleteMany({
        productId: Types.ObjectId(productId),
      })
      .exec();
  }
}

import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

type DT<T> = DocumentType<T>;

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<DT<ProductModel>> {
    return this.productModel.create(createProductDto);
  }

  async getById(id: string): Promise<DT<ProductModel> | null> {
    return this.productModel.findById(Types.ObjectId(id)).exec();
  }

  async updateById(
    id: string,
    updateProductDto: CreateProductDto,
  ): Promise<DT<ProductModel> | null> {
    return this.productModel
      .findByIdAndUpdate(Types.ObjectId(id), updateProductDto, {
        new: true,
      })
      .exec();
  }

  async deleteById(id: string): Promise<DT<ProductModel> | null> {
    return this.productModel
      .findOneAndDelete({
        _id: Types.ObjectId(id),
      })
      .exec();
  }

  async findWithReviews(findProductDto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: findProductDto.category,
          },
        },
        {
          // В монге есть стабильная и нестабильная сортировка.
          // Стабильная сортировка - сортировка по стабильному полю, id, например
          // read: https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: findProductDto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewsCount: { $size: '$reviews' },
            reviewsAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec() as (ProductModel & {
      reviews: ReviewModel[];
      reviewsCount: number;
      reviewsAvg: number | null;
    })[];
  }
}

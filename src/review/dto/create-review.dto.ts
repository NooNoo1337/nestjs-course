import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(1, { message: 'Rating cannot be less than 1' })
  @Max(5, { message: 'Rating cannot be greater than 5' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}

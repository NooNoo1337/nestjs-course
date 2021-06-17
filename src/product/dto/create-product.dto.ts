import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
} from 'class-validator';

class ProductPriceDto {
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    discount?: number;
}

class ProductCharacteristicDto {
    @IsString()
    name: string;

    @IsString()
    value: string;
}

export class CreateProductDto {
    @IsString()
    image: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @ValidateNested()
    @Type(() => ProductPriceDto)
    price: ProductPriceDto;

    @IsNumber()
    credit: number;

    @IsString()
    advantages: string;

    @IsString()
    disadvantages: string;

    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductCharacteristicDto)
    characteristics: ProductCharacteristicDto[];
}

import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class HhDataDto {
    @IsNumber()
    count: number;

    @IsNumber()
    juniorSalary: number;

    @IsNumber()
    middleSalary: number;

    @IsNumber()
    seniorSalary: number;
}

export class TopPageAdvantageDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateTopPageDto {
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;

    @IsString()
    secondCategory: string;

    @IsString()
    title: string;

    @IsString()
    alias: string;

    @IsOptional()
    @IsString()
    description?: string;

    category: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HhDataDto)
    hh?: HhDataDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TopPageAdvantageDto)
    advantages?: TopPageAdvantageDto[];

    tagsTitle: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}

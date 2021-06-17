import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';

type DT<T> = DocumentType<T>;

type FoundByCategoryTopPage = Pick<
    TopPageModel,
    'alias' | 'secondCategory' | 'title'
>;

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel)
        private readonly topPageModel: ModelType<TopPageModel>,
    ) {}

    async create(createPageDto: CreateTopPageDto): Promise<DT<TopPageModel>> {
        return this.topPageModel.create(createPageDto);
    }

    async getById(id: string): Promise<DT<TopPageModel> | null> {
        return this.topPageModel.findById(Types.ObjectId(id));
    }

    async getByAlias(alias: string): Promise<DT<TopPageModel> | null> {
        return this.topPageModel.findOne({
            alias,
        });
    }

    async updateById(
        id: string,
        updatePageDto: TopPageModel,
    ): Promise<DT<TopPageModel> | null> {
        return this.topPageModel
            .findByIdAndUpdate({ _id: Types.ObjectId(id) }, updatePageDto, {
                new: true,
            })
            .exec();
    }

    async deleteById(id: string): Promise<DT<TopPageModel> | null> {
        return this.topPageModel
            .findByIdAndDelete({ _id: Types.ObjectId(id) })
            .exec();
    }

    async findByCategory(
        findPageDto: FindTopPageDto,
    ): Promise<DT<FoundByCategoryTopPage>[]> {
        return this.topPageModel
            .aggregate()
            .match({ firstCategory: findPageDto.firstCategory })
            .group({
                _id: {
                    secondCategory: '$secondCategory',
                },
                pages: {
                    $push: {
                        alias: '$alias',
                        title: '$title',
                    },
                },
            })
            .exec();
    }

    async findByText(text: string): Promise<DT<FoundByCategoryTopPage>[]> {
        return this.topPageModel
            .find({ $text: { $search: text, $caseSensitive: false } })
            .exec();
    }
}

/* eslint-disable @typescript-eslint/no-empty-interface */
import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum TopLevelCategory {
    Courses = 'courses',
    Services = 'services',
    Books = 'books',
    Products = 'products',
}

export class TopPageAdvantage {
    @prop()
    title: string;

    @prop()
    description: string;
}

export class HhData {
    @prop()
    count: number;

    @prop()
    juniorSalary: number;

    @prop()
    middleSalary: number;

    @prop()
    seniorSalary: number;
}

export interface TopPageModel extends Base {}

@index({ title: 'text', description: 'text' })
export class TopPageModel extends TimeStamps {
    @prop({ enum: TopLevelCategory })
    firstCategory: TopLevelCategory;

    @prop()
    secondCategory: string;

    @prop()
    title: string;

    @prop({ unique: true })
    alias: string;

    @prop()
    description?: string;

    @prop()
    category: string;

    @prop({ type: () => HhData, _id: false })
    hh?: HhData;

    @prop({ type: () => [TopPageAdvantage], _id: false })
    advantages?: TopPageAdvantage[];

    @prop()
    tagsTitle: string;

    @prop({ type: () => [String] })
    tags: string[];
}

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

describe('ProductService', () => {
    let service: ProductService;

    const create = jest.fn();
    const exec = { exec: jest.fn() };

    const productRepositoryFactory = () => ({
        create,
        findOneAndDelete: () => exec,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    useFactory: productRepositoryFactory,
                    provide: getModelToken('ProductModel'),
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should implements create method', async () => {
        const productDto: CreateProductDto = {
            image: '',
            title: 'Title',
            description: 'Description',
            credit: 0,
            advantages: 'Some advantages',
            disadvantages: 'Some advantages',
            price: {
                value: 10000,
            },
            categories: ['category1', 'category2'],
            tags: ['tag1', 'tag2'],
            characteristics: [{ name: 'Length', value: '2 km' }],
        };

        productRepositoryFactory().create.mockReturnValue(productDto);

        const createdProduct = await service.create(productDto);

        expect(createdProduct).toStrictEqual({
            image: '',
            title: 'Title',
            description: 'Description',
            credit: 0,
            advantages: 'Some advantages',
            disadvantages: 'Some advantages',
            price: {
                value: 10000,
            },
            categories: ['category1', 'category2'],
            tags: ['tag1', 'tag2'],
            characteristics: [{ name: 'Length', value: '2 km' }],
        });
    });
});

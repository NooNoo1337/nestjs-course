import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
    let service: ReviewService;

    const exec = { exec: jest.fn() };
    const create = jest.fn();

    const reviewRepositoryFactory = () => ({
        create,
        find: () => exec,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    useFactory: reviewRepositoryFactory,
                    provide: getModelToken('ReviewModel'),
                },
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should implements create method', async () => {
        const id = new Types.ObjectId().toHexString();

        const reviewDto = {
            name: 'Test',
            title: 'Test review',
            description: 'Description for test review',
            rating: 5,
            productId: id,
        };

        reviewRepositoryFactory().create.mockReturnValue(reviewDto);

        const result = await service.create(reviewDto);

        expect(result).toStrictEqual({
            name: 'Test',
            title: 'Test review',
            description: 'Description for test review',
            rating: 5,
            productId: id,
        });
    });

    it('should implements findByProductId method', async () => {
        const id = new Types.ObjectId().toHexString();

        reviewRepositoryFactory()
            .find()
            .exec.mockReturnValue([{ productId: id }]);

        const result = await service.findByProductId(id);

        expect(result[0].productId).toBe(id);
    });
});

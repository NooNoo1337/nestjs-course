import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

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

describe('ProductController (e2e)', () => {
    let app: INestApplication;
    let createdProductId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(() => {
        disconnect();
    });

    it('/product/create (POST) - success', async (done) => {
        return request(app.getHttpServer())
            .post('/product/create')
            .send(productDto)
            .expect(201)
            .then(({ body }: request.Response) => {
                createdProductId = body._id;

                expect(createdProductId).toBeDefined();

                done();
            });
    });

    it('/product/create (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/product/create')
            .send({ ...productDto, price: { value: true } })
            .expect(400);
    });

    it('/product/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/product/' + createdProductId)
            .expect(200);
    });
});

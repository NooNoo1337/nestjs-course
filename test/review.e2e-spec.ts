import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUNT } from '../src/review/review.constants';
import { SignInUserDto } from 'src/auth/dto/sign-in-user.dto';

const productId = new Types.ObjectId().toHexString();

const getRandomProductId = () => new Types.ObjectId().toHexString();

const reviewDto: CreateReviewDto = {
  name: 'Test',
  title: 'Test review',
  description: 'Description for test review',
  rating: 5,
  productId,
};

const LOGIN_DTO: SignInUserDto = {
  login: 'a1@mail.ru',
  password: '123',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdReviewId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(LOGIN_DTO);

    token = body.access_token;
  });

  afterAll(() => {
    disconnect();
  });

  it('/review/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(reviewDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdReviewId = body._id;

        expect(createdReviewId).toBeDefined();

        done();
      });
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...reviewDto, rating: -1 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);

        done();
      });
  });

  it('/review/byProduct/:productId (GET) - fail', async (done) => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + getRandomProductId())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);

        done();
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdReviewId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + getRandomProductId())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUNT,
      });
  });
});

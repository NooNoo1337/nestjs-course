import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateTopPageDto } from '../src/top-page/dto/create-top-page.dto';
import { TopLevelCategory } from '../src/top-page/top-page.model';
import { SignInUserDto } from '../src/auth/dto/sign-in-user.dto';

const generateRandomID = () => new Types.ObjectId().toHexString();

const LOGIN_DTO: SignInUserDto = {
    login: 'admin@admin.ru',
    password: 'admin',
};

const productDto: CreateTopPageDto = {
    firstCategory: TopLevelCategory.Products,
    secondCategory: 'secondCategory',
    title: 'Test page title',
    hh: {
        count: 12,
        juniorSalary: 60000,
        middleSalary: 150000,
        seniorSalary: 240000,
    },
    advantages: [
        {
            title: 'First advantage',
            description: 'Advantage description',
        },
    ],
    alias: 'test' + Math.random(),
    category: 'Food',
    tagsTitle: 'tagsTitle',
    tags: ['tag1', 'tag2'],
};

const topPageRoute = 'top-page';

describe('TopPageController (e2e)', () => {
    let app: INestApplication;
    let createdTopPageId: string;
    let server: request.SuperTest<request.Test>;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        server = request(app.getHttpServer());

        const { body } = await server.post('/auth/login').send(LOGIN_DTO);

        token = body.access_token;
    });

    afterAll(() => {
        disconnect();
    });

    describe('Create', () => {
        it(`/${topPageRoute}/create (POST) - success`, async (done) => {
            return server
                .post(`/${topPageRoute}/create`)
                .send(productDto)
                .set('Authorization', `Bearer ${token}`)
                .expect(201)
                .then(({ body }: request.Response) => {
                    createdTopPageId = body._id;

                    expect(createdTopPageId).toBeDefined();

                    done();
                });
        });

        it(`/${topPageRoute}/create (POST) - fail`, () => {
            return server
                .post(`/${topPageRoute}/create`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...productDto, firstCategory: 'noodle' })
                .expect(400);
        });
    });

    describe('Get by id', () => {
        it(`/${topPageRoute}/:id (GET) - success`, () => {
            return server
                .get('/top-page/' + createdTopPageId)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it(`/${topPageRoute}/:id (GET) - fail`, () => {
            return server
                .get('/top-page/' + generateRandomID())
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('Get by alias', () => {
        it(`/${topPageRoute}/byAlias/:alias (GET) - success`, async (done) => {
            return server
                .get(`/${topPageRoute}/byAlias/` + productDto.alias)
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.alias).toBe(productDto.alias);

                    done();
                });
        });

        it(`/${topPageRoute}/byAlias/:alias (GET) - fail`, () => {
            return server
                .get(`/${topPageRoute}/byAlias/` + Math.random().toString())
                .expect(404);
        });
    });

    describe('Find by category', () => {
        const route = `/${topPageRoute}/findByCategory`;

        it(`/${topPageRoute}/findByCategory (POST) - success`, async (done) => {
            return server
                .post(route)
                .send({ firstCategory: productDto.firstCategory })
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.length).toBeGreaterThanOrEqual(1);

                    done();
                });
        });

        it(`/${topPageRoute}/findByCategory (POST) - fail`, async (done) => {
            return server
                .post(route)
                .send({ firstCategory: 'noodle' })
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.length).toBe(0);

                    done();
                });
        });
    });

    describe('Find by text', () => {
        const route = `/${topPageRoute}/findByText/`;

        it(`/${topPageRoute}/findByText (POST) - success`, async (done) => {
            return server
                .post(route + 'test')
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.length).toBeGreaterThanOrEqual(1);

                    done();
                });
        });

        it(`/${topPageRoute}/findByText (POST) - fail`, async (done) => {
            return server
                .post(route + 'hellokitty')
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.length).toBe(0);

                    done();
                });
        });
    });

    describe('Update', () => {
        it(`/${topPageRoute}/:id (PATCH) - success`, async (done) => {
            return server
                .patch('/top-page/' + createdTopPageId)
                .send({ ...productDto, title: 'Patched test page title' })
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }: request.Response) => {
                    expect(body.title).toBe('Patched test page title');

                    done();
                });
        });

        it(`/${topPageRoute}/:id (PATCH) - fail`, () => {
            return server
                .patch('/top-page/' + generateRandomID())
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('Delete', () => {
        it(`/${topPageRoute}/:id (DELETE) - success`, () => {
            return server
                .delete('/top-page/' + createdTopPageId)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it(`/${topPageRoute}/:id (DELETE) - fail`, () => {
            return server
                .delete('/top-page/' + generateRandomID())
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });
});

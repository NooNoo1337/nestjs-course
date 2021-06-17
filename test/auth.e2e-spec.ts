import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { SignInUserDto } from 'src/auth/dto/sign-in-user.dto';
import {
    USER_DOES_NOT_EXIST_ERROR,
    USER_WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';

const LOGIN_DTO: SignInUserDto = {
    login: 'admin@admin.ru',
    password: 'admin',
};

describe('AuthController (e2e)', () => {
    let app: INestApplication;

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

    it('/auth/login (POST) - success', async (done) => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(LOGIN_DTO)
            .expect(200)
            .then((req: request.Response) => {
                expect(req.body.access_token).toBeDefined();
                done();
            });
    });

    it('/auth/login (POST) - fail. User does not exist', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...LOGIN_DTO, login: 'never_existing_email@mail.ru' })
            .expect(401, {
                statusCode: 401,
                message: USER_DOES_NOT_EXIST_ERROR,
                error: 'Unauthorized',
            });
    });

    it('/auth/login (POST) - fail. Password is invalid', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...LOGIN_DTO, password: 'never_existing_password' })
            .expect(401, {
                statusCode: 401,
                message: USER_WRONG_PASSWORD_ERROR,
                error: 'Unauthorized',
            });
    });
});

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { configureTest, createModules } from '../../config';
import { ROUTES } from '@core/enums/routes.enum';

configureTest();

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    app = await createModules();
  });

  beforeEach(async () => {
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await httpServer.close();
  });

  let accessToken = null;

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - successfull user login (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'user@test.com', password: '12345678' })
      .expect(201)
      .expect((response) => {
        const result = expect(response.body).toMatchObject({
          access_token: expect.any(String),
        });

        accessToken = response.body.access_token;
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - wrong credentials (POST)`, () => {
    return request(app.getHttpServer())
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'wrong@email.com', password: 'wrongPassword' })
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE} - validate session without token (POST)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE}`)
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE} - validate session valid token (GET)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          status: 'VALID',
        });
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout without token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout with valid token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(200)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((response) => {
        expect(response.body).toMatchObject({
          message: 'session closed successfully',
        });
      });
  });

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout with revoked token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(401)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

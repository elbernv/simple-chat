import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { configureTest, createModules } from '../../config';
import { ROUTES } from '@core/enums/routes.enum';

configureTest();

describe('MeController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    app = await createModules();
    httpServer = app.getHttpServer();
  });

  let accessToken = null;

  it(`${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - me - successfull user login (POST)`, () => {
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

  afterAll(async () => {
    await app.close();
  });
});
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { configureTest, createModules } from '../../config';
import { ROUTES } from '@core/enums/routes.enum';
import { MeModule } from '@me/me.module';

configureTest();

describe('MeController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    app = await createModules([MeModule]);
    httpServer = app.getHttpServer();
  });

  let userAccessToken = null;
  let customerAccessToken = null;

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - me - successfull user login (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'user@test.com', password: '12345678' })
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          access_token: expect.any(String),
        });

        userAccessToken = response.body.access_token;
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - me - successfull customer login (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'customer@test.com', password: '12345678' })
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          access_token: expect.any(String),
        });

        customerAccessToken = response.body.access_token;
      });
  });

  it(`/${ROUTES.ME} - me info (customer) (POST)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.ME}`)
      .set('Authorization', `Bearer ${customerAccessToken}`)
      .expect(200)
      .expect((response) => {
        return expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          lastName: expect.any(String),
          imgUrl: expect['toBeTypeOrNull'](String),
          updatedAt: expect.any(String),
          type: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          session: {
            timesLoggedIn: expect.any(Number),
            lastAccess: expect.any(String),
            email: expect.any(String),
          },
        });
      });
  });

  it(`/${ROUTES.ME} - me info (user) (POST)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.ME}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200)
      .expect((response) => {
        return expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          lastName: expect.any(String),
          imgUrl: expect['toBeTypeOrNull'](String),
          updatedAt: expect.any(String),
          type: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          session: {
            timesLoggedIn: expect.any(Number),
            lastAccess: expect.any(String),
            email: expect.any(String),
          },
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

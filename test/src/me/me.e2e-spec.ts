import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import minifaker from 'minifaker';
import 'minifaker/locales/en';

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
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
          type: expect.any(Number),
        });
      })
      .ok((response) => {
        userAccessToken = response.body.access_token;
        return true;
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - me - successfull customer login (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'customer@test.com', password: '12345678' })
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
          type: expect.any(Number),
        });
      })
      .ok((response) => {
        customerAccessToken = response.body.access_token;
        return true;
      });
  });

  it(`/${ROUTES.ME} - me info (customer) (GET)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.ME}/customer`)
      .set('Authorization', `Bearer ${customerAccessToken}`)
      .expect(200)
      .expect((response) => {
        return expect(response.body).toEqual({
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

  it(`/${ROUTES.ME} - me info (user) (GET)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.ME}/user`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200)
      .expect((response) => {
        return expect(response.body).toEqual({
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

  it(`/${ROUTES.ME} - me update (customer) (PATCH)`, () => {
    const updateBody = {
      name: minifaker.name(),
      lastName: minifaker.lastName(),
    };

    return request(httpServer)
      .patch(`/${ROUTES.ME}/customer`)
      .send(updateBody)
      .set('Authorization', `Bearer ${customerAccessToken}`)
      .expect(200)
      .expect((response) => {
        return expect(response.body).toEqual({
          message: 'Customer Updated',
          id: expect.any(Number),
          name: updateBody.name,
          lastName: updateBody.lastName,
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

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
  let refreshToken = null;
  let accessToken2 = null;
  let refreshToken2 = null;

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - successfull user login (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'user@test.com', password: '12345678' })
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
        });
      })
      .ok((response) => {
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        return true;
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - successfull user login for second tokens (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'user@test.com', password: '12345678' })
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
        });
      })
      .ok((response) => {
        accessToken2 = response.body.access_token;
        refreshToken2 = response.body.refresh_token;
        return true;
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN} - wrong credentials (POST)`, () => {
    return request(app.getHttpServer())
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGIN}`)
      .send({ username: 'wrong@email.com', password: 'wrongPassword' })
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE} - validate session without token (POST)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE}`)
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE} - validate session valid token (GET)`, () => {
    return request(httpServer)
      .get(`/${ROUTES.AUTH}/${ROUTES.AUTH_VALIDATE}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          status: 'VALID',
          expirationInSeconds: expect.any(Number),
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout without token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout with valid token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(200)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((response) => {
        expect(response.body).toEqual({
          message: 'session closed successfully',
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT} - logout with revoked token (DELETE)`, () => {
    return request(httpServer)
      .delete(`/${ROUTES.AUTH}/${ROUTES.AUTH_LOGOUT}`)
      .expect(401)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH} - refresh session with wrong data (POST)`, () => {
    return Promise.all([
      request(httpServer)
        .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
        .send({ access_token: '', refresh_token: '' })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
        .send({ access_token: accessToken, refresh_token: '' })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
        .send({ access_token: '1', refresh_token: refreshToken })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
        .send({ access_token: accessToken, refresh_token: refreshToken2 })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
        .send({ access_token: accessToken2, refresh_token: refreshToken })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: 'Bad Request',
          });
        }),
    ]);
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH} - refresh session with valid data (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
      .expect(200)
      .send({ access_token: accessToken, refresh_token: refreshToken })
      .expect((response) => {
        expect(response.body).toEqual({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
        });
      });
  });

  it(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH} - refresh session with used token (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.AUTH}/${ROUTES.AUTH_REFRESH}`)
      .expect(401)
      .send({ access_token: accessToken, refresh_token: refreshToken })
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import minifaker from 'minifaker';
import 'minifaker/locales/en';

import { configureTest, createModules } from '../../config';
import { ROUTES } from '@core/enums/routes.enum';
import { CustomerModule } from '@customer/customer.module';

configureTest();

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    app = await createModules([CustomerModule]);

    httpServer = app.getHttpServer();
  });

  let accessToken = null;
  let customerCreatedId = null;

  it(`/${ROUTES.CUSTOMER} - wrong data for customer create (POST)`, () => {
    return Promise.all([
      request(httpServer)
        .post(`/${ROUTES.CUSTOMER}`)
        .send({})
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: [
              'name must be longer than or equal to 3 characters',
              'name must be a string',
              'email must be an email',
              'password must be a string',
            ],
            error: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.CUSTOMER}`)
        .send({ name: minifaker.firstName() })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['email must be an email', 'password must be a string'],
            error: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.CUSTOMER}`)
        .send({ name: minifaker.firstName(), email: minifaker.email() })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['password must be a string'],
            error: 'Bad Request',
          });
        }),
      request(httpServer)
        .post(`/${ROUTES.CUSTOMER}`)
        .send({
          name: minifaker.firstName(),
          email: minifaker.email(),
          password: '1234567',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['password must be longer than or equal to 8 characters'],
            error: 'Bad Request',
          });
        }),
    ]);
  });

  it(`/${ROUTES.CUSTOMER} - successfull customer creation (POST)`, () => {
    return request(httpServer)
      .post(`/${ROUTES.CUSTOMER}`)
      .send({
        name: minifaker.firstName(),
        email: minifaker.email(),
        password: '12345678',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual({
          message: 'Customer Created',
          url: expect.any(String),
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          expirationInSeconds: expect.any(Number),
        });
      })
      .ok((response) => {
        accessToken = response.body.access_token;
        customerCreatedId =
          response.body.url.split('/')[response.body.url.split('/').length - 1];
        return true;
      });
  });

  it(`/${ROUTES.CUSTOMER} - successfull customer update (PATCH)`, () => {
    const updateBody = {
      name: minifaker.name(),
      lastName: minifaker.lastName(),
    };

    return request(httpServer)
      .patch(`/${ROUTES.CUSTOMER}/${customerCreatedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateBody)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
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

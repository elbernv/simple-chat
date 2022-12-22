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

  it(`${ROUTES.CUSTOMER} - wrong data for customer create (POST)`, () => {
    return Promise.all([
      request(httpServer)
        .post(`/${ROUTES.CUSTOMER}`)
        .send({})
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            statusCode: 400,
            message: [
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
          expect(response.body).toMatchObject({
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
          expect(response.body).toMatchObject({
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
          expect(response.body).toMatchObject({
            statusCode: 400,
            message: ['password must be longer than or equal to 8 characters'],
            error: 'Bad Request',
          });
        }),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});

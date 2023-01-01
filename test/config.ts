import {
  CacheModule,
  DynamicModule,
  ForwardReference,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as redisStore from 'cache-manager-redis-store';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AuthModule } from '@auth/auth.module';
import { PrismaModule } from '@core/prisma/prisma.module';

export function configureTest() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this);
  };

  expect.extend({
    toBeTypeOrNull(received, classTypeOrNull) {
      try {
        if (typeof classTypeOrNull === 'object') {
          expect(received).toMatchObject(classTypeOrNull);
        } else {
          expect(received).toEqual(expect.any(classTypeOrNull));
        }

        return {
          message: () => `Ok`,
          pass: true,
        };
      } catch (error) {
        return received === null
          ? {
              message: () => `Ok`,
              pass: true,
            }
          : {
              message: () =>
                `expected ${received} to be ${classTypeOrNull} type or null`,
              pass: false,
            };
      }
    },
  });
}

export async function createModules(
  modules: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  > = [],
) {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
      CacheModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          store: redisStore,
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        }),
        isGlobal: true,
        inject: [ConfigService],
      }),
      PrismaModule,
      AuthModule,
      ...modules,
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
    ],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  return app.init();
}

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ScopesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

function getConfiguration(configService: ConfigService): {
  port: string;
  hostname: string;
  dbHost: string;
  dbName: string;
  redisHost: string;
} {
  return {
    port: configService.get('LOCAL_PORT'),
    hostname: configService.get('HOST'),
    dbHost: configService.get('DB_HOST'),
    dbName: configService.get('DB_NAME'),
    redisHost: configService.get('REDIS_HOST'),
  };
}

function configureOpenApi(app: NestExpressApplication): { url: string } {
  const openApiUrl = 'doc';
  const config = new DocumentBuilder()
    .addBearerAuth({
      flows: {
        password: {
          tokenUrl: 'http://localhost:7015/auth/login',
          scopes: {},
          authorizationUrl: 'http://localhost:7015/auth/login',
        },
      },
      type: 'oauth2',
      description:
        'it is not necessary to send the client_id or the client_secret',
    })
    .setTitle('Simple Chat')
    .setDescription('The Simple-Chat API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(openApiUrl, app, document);

  return { url: openApiUrl };
}

async function configureApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

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

  return app;
}

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this);
  };

  const logger = new Logger('Info');
  const app = await configureApp();

  const configService = app.get(ConfigService);
  const configuration = getConfiguration(configService);

  const openApi = configureOpenApi(app);

  await app.listen(configuration.port, configuration.hostname);

  logger.log(`App running in port ${configuration.port}`);
  logger.log(`App Documentation route is /${openApi.url}`);
}
bootstrap();

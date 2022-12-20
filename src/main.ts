import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

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

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this);
  };

  const logger = new Logger('Info');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const configuration = getConfiguration(configService);

  await app.listen(configuration.port, configuration.hostname);

  logger.log(`App running in port ${configuration.port}`);
}
bootstrap();

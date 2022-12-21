import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
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
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

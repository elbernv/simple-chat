import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ImagesModule } from '@core/images/images.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserModule } from '@user/user.module';
import { CustomerModule } from '@customer/customer.module';
import { MeModule } from '@me/me.module';
import { ChatModule } from './modules/chat/chat.module';

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
    MeModule,
    ImagesModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

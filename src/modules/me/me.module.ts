import { Module } from '@nestjs/common';

import { MeController } from '@me/controllers/me.controller';
import { MeRepository } from '@me/repositories/me.repository';
import { MeService } from '@me/services/me.service';

import { CustomerModule } from '@customer/customer.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { editFileName } from '@utils/file-upload.utils';

@Module({
  imports: [
    CustomerModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('CUSTOMER_PICTURES_FOLDER'),
          filename: editFileName,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MeController],
  providers: [MeRepository, MeService],
})
export class MeModule {}

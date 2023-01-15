import { Module } from '@nestjs/common';

import { MeController } from '@me/controllers/me.controller';
import { MeRepository } from '@me/repositories/me.repository';
import { MeService } from '@me/services/me.service';

import { CustomerModule } from '@customer/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [MeController],
  providers: [MeRepository, MeService],
})
export class MeModule {}

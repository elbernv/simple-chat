import { Module } from '@nestjs/common';

import { ImagesModule } from '@core/images/images.module';
import { CustomerController } from '@customer/controllers/customer.controller';
import { CustomerService } from '@customer/services/customer.service';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule, ImagesModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService],
})
export class CustomerModule {}

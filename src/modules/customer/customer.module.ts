import { Module } from '@nestjs/common';

import { CustomerController } from '@customer/controllers/customer.controller';
import { CustomerService } from '@customer/services/customer.service';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}

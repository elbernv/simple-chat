import { Module } from '@nestjs/common';

import { ImagesModule } from '@core/images/images.module';
import { AuthModule } from '@auth/auth.module';
import { CustomerController } from '@customer/controllers/customer.controller';
import { CustomerService } from '@customer/services/customer.service';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { CustomerSerializer } from '@customer/serializer/customer.serializer';
import { CustomerEventsGateway } from '@customer/websockets-events/customer.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), AuthModule, ImagesModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    CustomerSerializer,
    CustomerEventsGateway,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}

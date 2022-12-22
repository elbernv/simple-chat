import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { Public } from '@auth/decorators/public.decorator';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerService } from '@customer/services/customer.service';

@ApiTags(ROUTES.CUSTOMER.toUpperCase())
@Controller(ROUTES.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Public()
  @Post()
  public async createCustomer(@Body() body: CreateCustomerDto) {
    return this.customerService.createCustomer(body);
  }
}

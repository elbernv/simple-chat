import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { Public } from '@auth/decorators/public.decorator';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerService } from '@customer/services/customer.service';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';

@ApiTags(ROUTES.CUSTOMER.toUpperCase())
@Controller(ROUTES.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Public()
  @Post()
  public async createCustomer(@Body() body: CreateCustomerDto) {
    return this.customerService.createCustomer(body);
  }

  @Patch(':id')
  public async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, body);
  }
}

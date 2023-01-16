import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as IResponse } from 'express';

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

  @Public()
  @Get('picture/:name')
  public async servePicture(
    @Response({ passthrough: true }) response: IResponse,
    @Param('name') name: string,
  ): Promise<StreamableFile | BadRequestException> {
    return this.customerService.servePicture(response, name);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authService: AuthService,
  ) {}

  public async createCustomer(body: CreateCustomerDto) {
    const newCustomer = await this.customerRepository.createCustomer(body);
    const { access_token, refresh_token, expirationInSeconds } =
      await this.authService.generateAccessToken({
        id: newCustomer.session.id,
        type: newCustomer.session.typeId,
      });

    const url = this.customerRepository.buildUrl(
      newCustomer.id,
      ROUTES.CUSTOMER,
    );

    return {
      message: 'Customer Created',
      url,
      access_token,
      refresh_token,
      expirationInSeconds,
    };
  }

  public async updateCustomer(id: number, body: UpdateCustomerDto) {
    const updatedCustomer = await this.customerRepository.updateCustomer(
      id,
      body,
    );

    return {
      message: 'Customer Updated',
      ...updatedCustomer,
    };
  }
}

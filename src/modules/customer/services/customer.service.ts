import { Injectable } from '@nestjs/common';

import { ROUTES } from '@core/enums/routes.enum';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { AuthService } from '@auth/services/auth.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authService: AuthService,
  ) {}

  public async createCustomer(body: CreateCustomerDto) {
    const newCustomer = await this.customerRepository.createCustomer(body);
    const { accessToken } = await this.authService.generateToken({
      id: newCustomer.session.id,
    });

    const url = this.customerRepository.buildUrl(
      newCustomer.id,
      ROUTES.CUSTOMER,
    );

    return {
      message: 'Customer Created',
      url,
      accessToken,
    };
  }
}

import { Injectable } from '@nestjs/common';

import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerRepository } from '@customer/respositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authService: AuthService,
  ) {}

  public async createCustomer(body: CreateCustomerDto) {
    const newCustomer = await this.customerRepository.createCustomer(body);
    const { access_token } = await this.authService.generateToken({
      id: newCustomer.session.id,
      typeId: newCustomer.session.typeId,
    });

    const url = this.customerRepository.buildUrl(
      newCustomer.id,
      ROUTES.CUSTOMER,
    );

    return {
      message: 'Customer Created',
      url,
      access_token,
    };
  }
}

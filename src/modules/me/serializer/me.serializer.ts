import { customer } from '@customer/types/customer.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeSerializer {
  constructor(private readonly configService: ConfigService) {}

  public serializeOneCustomer(customer: customer) {
    delete customer.session.password;
    customer.imgUrl = this.serializeImage(customer.imgUrl);

    return customer;
  }

  public serializeImage(path: string) {
    return `${this.configService.get('BASE_URL')}/customers/picture/${path}`;
  }
}

import { customer } from '@customer/types/customer.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerSerializer {
  constructor(private readonly configService: ConfigService) {}

  public serializeOneCustomer(customer: customer): {
    id: bigint;
    name: string;
    lastName: string;
    imgUrl: string;
  } {
    const serializedCustomer = {
      id: customer.id,
      name: customer.name,
      lastName: customer.lastName,
      imgUrl: this.serializeImage(customer.imgUrl),
    };

    return serializedCustomer;
  }

  private serializeImage(path: string) {
    return `${this.configService.get('BASE_URL')}/customers/picture/${path}`;
  }

  public serializeManyCustomers(customers: Array<customer>) {
    const serializedCustomers: Array<{
      id: bigint;
      name: string;
      lastName: string;
      imgUrl: string;
    }> = [];
    for (let customer of customers) {
      const serializedCustomer = this.serializeOneCustomer(customer);
      serializedCustomers.push(serializedCustomer);
    }

    return serializedCustomers;
  }
}

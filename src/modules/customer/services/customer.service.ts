import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImagesService } from '@core/images/services/images.service';
import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerRepository } from '@customer/respositories/customer.repository';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';
import { Response } from 'express';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authService: AuthService,
    private readonly imagesService: ImagesService,
    private readonly configService: ConfigService,
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

  public async servePicture(response: Response, name: string) {
    const folder = this.configService.get('CUSTOMER_PICTURES_FOLDER');

    return this.imagesService.serveImage(folder, name, response);
  }
}

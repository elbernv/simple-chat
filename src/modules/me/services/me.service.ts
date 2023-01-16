import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { customer, customerFields } from '@customer/types/customer.types';
import { CustomerService } from '@customer/services/customer.service';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';
import { MeRepository } from '@me/repositories/me.repository';
import { MeSerializer } from '@me/serializer/me.serializer';

@Injectable()
export class MeService {
  constructor(
    private readonly meRepository: MeRepository,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
    private readonly meSerializer: MeSerializer,
  ) {}

  public async getCustomerMyInfo(sessionInfo: SessionInfoType) {
    const customerFindOptions: Prisma.customerFindFirstArgs = {
      where: { id: sessionInfo.id },
      select: customerFields,
    };
    const customerInfo: customer = await this.meRepository.findOneCustomer(
      customerFindOptions,
    );

    return this.meSerializer.serializeOneCustomer(customerInfo);
  }

  public async getUserMyInfo(sessionInfo: SessionInfoType) {
    const userFindOptions: Prisma.userFindFirstArgs = {
      where: { id: sessionInfo.id },
      select: {
        id: true,
        name: true,
        lastName: true,
        imgUrl: true,
        updatedAt: true,
        type: { select: { id: true, name: true } },
        session: {
          select: { timesLoggedIn: true, lastAccess: true, email: true },
        },
      },
    };

    return this.meRepository.findOneUser(userFindOptions);
  }

  public async updateCustomer(id: number, body: UpdateCustomerDto) {
    return this.customerService.updateCustomer(id, body);
  }

  public async saveCustomerPicture(
    file: Express.Multer.File,
    sessionInfo: SessionInfoType,
  ) {
    const body = { imgUrl: file.filename };

    const updatedCustomer = await this.customerService.updateCustomer(
      sessionInfo.id,
      body,
    );

    const imageUrl = `${this.configService.get('BASE_URL')}/customers/picture/${
      updatedCustomer.imgUrl
    }`;

    return { message: 'Picture updated', url: imageUrl };
  }
}

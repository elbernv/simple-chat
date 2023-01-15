import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { SessionTypes } from '@core/enums/sessionTypes.enum';
import { MeRepository } from '@me/repositories/me.repository';
import { CustomerService } from '@customer/services/customer.service';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';

@Injectable()
export class MeService {
  constructor(
    private readonly meRepository: MeRepository,
    private readonly customerService: CustomerService,
  ) {}

  public async getCustomerMyInfo(sessionInfo: SessionInfoType) {
    const customerFindOptions: Prisma.customerFindFirstArgs = {
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

    return this.meRepository.findOneCustomer(customerFindOptions);
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
}

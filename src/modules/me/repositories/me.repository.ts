import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { customer } from '@customer/types/customer.types';

@Injectable()
export class MeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public readonly buildUrl = this.prismaService.buildUrl;
  private readonly logger = new Logger(MeRepository.name);

  public async findOneCustomer(
    findOptions: Prisma.customerFindFirstArgs,
  ): Promise<customer> {
    return (await this.prismaService.customer.findFirst(
      findOptions,
    )) as customer;
  }

  public async findOneUser(findOptions: Prisma.userFindFirstArgs) {
    return this.prismaService.user.findFirst(findOptions);
  }
}

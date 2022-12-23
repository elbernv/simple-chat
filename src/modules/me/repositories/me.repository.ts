import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOneCustomer(findOptions: Prisma.customerFindFirstArgs) {
    return this.prismaService.customer.findFirst(findOptions);
  }

  public async findOneUser(findOptions: Prisma.userFindFirstArgs) {
    return this.prismaService.user.findFirst(findOptions);
  }
}

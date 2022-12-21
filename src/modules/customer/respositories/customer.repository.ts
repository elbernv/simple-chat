import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerStatus, CustomerTypes } from '@customer/enums/customer.enums';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public readonly buildUrl = this.prismaService.buildUrl;
  private readonly logger = new Logger(CustomerRepository.name);

  public async createCustomer(body: CreateCustomerDto) {
    try {
      const customerType: number = CustomerTypes.STANDAR;
      const customerStatus: number = CustomerStatus.ACTIVE;

      return await this.prismaService.customer.create({
        select: {
          id: true,
          name: true,
          lastName: true,
          session: { select: { id: true, email: true } },
        },
        data: {
          name: body.name,
          ...(body.lastName && { lastName: body.lastName }),
          session: {
            create: { email: body.email, password: body.password },
          },
          status: { connect: { id: customerType } },
          type: { connect: { id: customerStatus } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('This email already exists');
      }

      this.logger.warn(error);
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { SessionTypes } from '@core/enums/sessionTypes.enum';
import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateCustomerDto } from '@customer/dtos/createCustomer.dto';
import { CustomerStatus, CustomerTypes } from '@customer/enums/customer.enums';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';

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
          session: { select: { id: true, email: true, typeId: true } },
        },
        data: {
          name: body.name,
          ...(body.lastName && { lastName: body.lastName }),
          session: {
            create: {
              email: body.email,
              password: body.password,
              type: { connect: { id: SessionTypes.CUSTOMER } },
            },
          },
          status: { connect: { id: customerType } },
          type: { connect: { id: customerStatus } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('This email already exists');
      }

      this.logger.error(error);

      throw new InternalServerErrorException(
        'an error occurred creating the customer',
      );
    }
  }

  public async updateCustomer(id: number, body: UpdateCustomerDto) {
    try {
      return this.prismaService.customer.update({
        where: { id },
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
        data: {
          ...(body.name && { name: body.name }),
          ...(body.lastName && { lastName: body.lastName }),
          ...(body.imgUrl && { imgUrl: body.imgUrl }),
          ...(body.password && {
            session: { update: { password: body.password } },
          }),
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'an error occurred updating the customer',
      );
    }
  }
}

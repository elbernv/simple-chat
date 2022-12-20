import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateUserDto } from '@user/dtos/createUser.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public readonly buildUrl = this.prismaService.buildUrl;
  private readonly logger = new Logger(UserRepository.name);

  public async createUser(body: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        select: {
          id: true,
          name: true,
          lastName: true,
          session: { select: { email: true } },
        },
        data: {
          name: body.name,
          ...(body.lastName && { lastName: body.lastName }),
          session: {
            create: { email: body.email, password: body.password },
          },
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

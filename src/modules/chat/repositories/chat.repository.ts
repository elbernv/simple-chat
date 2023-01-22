import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@core/prisma/services/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findManyMessages(findOptions: Prisma.messagesFindManyArgs) {
    return this.prismaService.messages.findMany(findOptions);
  }
}

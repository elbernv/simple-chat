import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';

@Injectable()
export class MeRepository {
  constructor(private readonly prismaService: PrismaService) {}
}

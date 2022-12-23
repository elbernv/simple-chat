import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSessionInfo(email: string) {
    const sessionInfo = await this.prismaService.session.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        typeId: true,
      },
    });

    return sessionInfo;
  }

  public async updateMetaData(sessionId: bigint) {
    await this.prismaService.session.update({
      where: { id: sessionId },
      data: { timesLoggedIn: { increment: 1 }, lastAccess: new Date() },
    });
  }
}

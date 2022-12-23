import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { MeRepository } from '@me/repositories/me.repository';
import { SessionTypes } from '@core/enums/sessionTypes.enum';

@Injectable()
export class MeService {
  constructor(private readonly meRepository: MeRepository) {}

  public async getMyInfo(sessionInfo: SessionInfoType) {
    if (sessionInfo.type === SessionTypes.USER) {
      const userFindOptions: Prisma.userFindFirstArgs = {
        where: { session: { id: sessionInfo.id } },
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
    } else {
      const customerFindOptions: Prisma.customerFindFirstArgs = {
        where: { session: { id: sessionInfo.id } },
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
  }
}

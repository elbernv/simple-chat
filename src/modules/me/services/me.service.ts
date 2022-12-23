import { Injectable } from '@nestjs/common';

import { MeRepository } from '@me/repositories/me.repository';

@Injectable()
export class MeService {
  constructor(private readonly meRepository: MeRepository) {}

  public async getMyInfo() {}
}

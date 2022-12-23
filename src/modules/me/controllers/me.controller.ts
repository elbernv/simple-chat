import { Controller, Get } from '@nestjs/common';

import { ROUTES } from '@core/enums/routes.enum';
import { MeService } from '@me/services/me.service';

@Controller(ROUTES.ME)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  public async getMyInfo() {
    return await this.meService.getMyInfo();
  }
}

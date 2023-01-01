import { Controller, Get } from '@nestjs/common';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { SessionInfo } from '@core/decorators/sessionInfo.decorator';
import { ROUTES } from '@core/enums/routes.enum';
import { MeService } from '@me/services/me.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ROUTES.ME.toUpperCase())
@Controller(ROUTES.ME)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  public async getMyInfo(@SessionInfo() sessionInfo: SessionInfoType) {
    return await this.meService.getMyInfo(sessionInfo);
  }
}

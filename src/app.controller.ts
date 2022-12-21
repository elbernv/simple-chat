import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { AppService } from './app.service';
import { Public } from '@auth/decorators/public.decorator';

@ApiTags('SAY HELLO')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

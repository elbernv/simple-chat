import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth-guard';
import { Public } from '@auth/decorators/public.decorator';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.LOGIN)
  @UseGuards(LocalAuthGuard)
  public async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}

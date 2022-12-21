import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth-guard';
import { Public } from '@auth/decorators/public.decorator';

@ApiTags(ROUTES.AUTH.toUpperCase())
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.AUTH_LOGIN)
  @UseGuards(LocalAuthGuard)
  public async login(@Request() req: any) {
    return this.authService.generateToken(req.user);
  }

  @Get(ROUTES.AUTH_VALIDATE)
  public async validateSession() {
    return {
      status: 'VALID',
    };
  }

  @ApiBearerAuth()
  @Delete(ROUTES.AUTH_LOGOUT)
  public async logout(@Request() req: any) {
    return this.authService.logout(req.user);
  }
}

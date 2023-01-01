import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { SessionInfo } from '@core/decorators/sessionInfo.decorator';
import { SessionInfoType } from '@core/types/sessionInfo.type';
import { AuthService } from '@auth/services/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth-guard';
import { Public } from '@auth/decorators/public.decorator';
import { JwtRefreshGuard } from '@auth/guards/jwt-refresh.guard';
import { LoginDto } from '@auth/dtos/login.dto';
import { RefreshTokenDto } from '@auth/dtos/refresh-token.dto';

@ApiTags(ROUTES.AUTH.toUpperCase())
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.AUTH_LOGIN)
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  public async login(@Request() req: any, @Body() body: LoginDto) {
    return await this.authService.generateAccessToken(req.user);
  }

  @ApiBearerAuth()
  @Get(ROUTES.AUTH_VALIDATE)
  public isValidSession(@SessionInfo() sessionInfo: SessionInfoType) {
    return this.authService.isValidSession(sessionInfo);
  }

  @ApiBearerAuth()
  @Delete(ROUTES.AUTH_LOGOUT)
  public async logout(@SessionInfo() sessionInfo: SessionInfoType) {
    return await this.authService.logout(sessionInfo);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post(ROUTES.AUTH_REFRESH)
  public async refreshToken(
    @SessionInfo() sessionInfo: SessionInfoType,
    @Body() body: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(sessionInfo, body.access_token);
  }
}

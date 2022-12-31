import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtBaseGuard } from '@auth/guards/jwt-base.guard';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly baseGuard: JwtBaseGuard) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const contextArgs: any = context.getArgs();
    const access_token = contextArgs[0].body?.refresh_token;

    if (!access_token) {
      throw new BadRequestException();
    }

    const isTokenRevoked = await this.baseGuard.tokenInBlacklist(access_token);

    if (isTokenRevoked) {
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }
}

import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@auth/services/auth.service';
import { IS_PUBLIC_KEY } from '@auth/decorators/public.decorator';

@Injectable()
export class JwtBaseGuard {
  constructor(
    private reflector: Reflector,
    public readonly authService: AuthService,
    public readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public routeIsPublic(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return false;
  }

  public async tokenIsRevoked(context: ExecutionContext): Promise<boolean> {
    const contextArgs: any = context.getArgs();
    const authorizationHeader = contextArgs[0].headers?.authorization;

    if (!authorizationHeader) {
      return true;
    }

    const access_token = authorizationHeader.split(' ')?.[1];

    if (!access_token) {
      return true;
    }

    const isTokenRevoked = await this.tokenInBlacklist(access_token);

    if (isTokenRevoked) {
      return true;
    }

    return false;
  }

  public async tokenInBlacklist(accessToken: string): Promise<boolean> {
    const decodeToken: any = this.authService.jwtService.decode(accessToken);

    if (!decodeToken) {
      return false;
    }

    const jti = decodeToken.jti;

    return (await this.cacheManager.get(jti)) || false;
  }
}

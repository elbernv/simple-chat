import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtBaseGuard } from '@auth/guards/jwt-base.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly baseGuard: JwtBaseGuard) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    if (this.baseGuard.routeIsPublic(context)) {
      return true;
    }

    const tokenIsRevoked = await this.baseGuard.tokenIsRevoked(context);

    if (tokenIsRevoked) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    return super.canActivate(context);
  }
}

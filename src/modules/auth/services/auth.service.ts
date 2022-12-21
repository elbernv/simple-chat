import { compareSync } from 'bcrypt';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';

import { AuthRepository } from '@auth/repositories/auth.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async generateToken(user: any) {
    const signOptions: JwtSignOptions = {
      jwtid: nanoid(32),
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '8h',
    };

    return {
      accessToken: this.jwtService.sign(user, signOptions),
    };
  }

  public async validate(email: string, password: string) {
    const sessionInfo = await this.authRepository.getSessionInfo(email);

    if (!sessionInfo || !compareSync(password, sessionInfo.password)) {
      return false;
    }

    return {
      id: sessionInfo.id,
    };
  }

  public async logout(tokenInfo: any) {
    await this.addTokenToBlackList(tokenInfo);

    return { message: 'session closed successfully' };
  }

  private async addTokenToBlackList(tokenInfo: any) {
    const jti = tokenInfo.jti;
    const now = Date.now();
    const exp = tokenInfo.exp * 1000;
    const ttl = differenceInSeconds(exp, now);

    await this.cacheManager.set(jti, jti, ttl);

    return true;
  }
}

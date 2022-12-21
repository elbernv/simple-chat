import { compareSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

import { AuthRepository } from '@auth/repositories/auth.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
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
}

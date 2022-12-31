import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { AuthRepository } from '@auth/repositories/auth.repositories';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { JwtBaseGuard } from '@auth/guards/jwt-base.guard';
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtBaseGuard,
  ],
  exports: [AuthService, JwtBaseGuard],
})
export class AuthModule {}

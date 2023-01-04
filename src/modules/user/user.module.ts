import { Module } from '@nestjs/common';

import { UserController } from '@user/controllers/user.controller';
import { UserService } from '@user/services/user.service';
import { UserRepository } from '@user/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}

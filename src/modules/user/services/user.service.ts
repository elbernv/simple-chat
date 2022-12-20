import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@user/dtos/createUser.dto';
import { UserRepository } from '@user/repositories/user.repository';

import { ROUTES } from '@core/enums/routes.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(body: CreateUserDto) {
    const newUser = await this.userRepository.createUser(body);

    const url = this.userRepository.buildUrl(newUser.id, ROUTES.USER);

    return {
      message: 'User created',
      url,
    };
  }
}

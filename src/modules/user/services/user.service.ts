import { Injectable } from '@nestjs/common';

import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { CreateUserDto } from '@user/dtos/createUser.dto';
import { UserRepository } from '@user/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  public async createUser(body: CreateUserDto) {
    const newUser = await this.userRepository.createUser(body);
    const { access_token } = await this.authService.generateToken({
      id: newUser.session.id,
      typeId: newUser.session.typeId,
    });

    const url = this.userRepository.buildUrl(newUser.id, ROUTES.USER);

    return {
      message: 'User created',
      url,
      access_token,
    };
  }
}

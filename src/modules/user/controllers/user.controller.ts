import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dtos/createUser.dto';

@ApiTags(ROUTES.USER.toUpperCase())
@Controller(ROUTES.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROUTES } from '@core/enums/routes.enum';
import { Public } from '@auth/decorators/public.decorator';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dtos/createUser.dto';

@ApiTags(ROUTES.USER.toUpperCase())
@Controller(ROUTES.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  public async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
}

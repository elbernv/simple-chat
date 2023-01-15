import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { passwordValidation } from '@user/dtos/createUser.dto';
export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(1)
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(passwordValidation)
  password?: string;
}

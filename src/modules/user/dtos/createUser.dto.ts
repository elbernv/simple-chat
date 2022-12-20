import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, minLength } from 'class-validator';
import { hashSync } from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

const passwordValidation = ({ value }) => {
  if (!minLength(value, 8)) {
    throw new BadRequestException([
      'password must be longer than or equal to 8 characters',
    ]);
  }

  return hashSync(value, 10);
};

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Transform(passwordValidation)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;
}

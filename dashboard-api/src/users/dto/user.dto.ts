import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../schema/user.schema';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  tookanUserId?: string;

  merchantName?: string;

  merchantId?: string;

  resetPasswordToken?: string;

  @IsNotEmpty()
  role: Role;

  isActive: boolean;
}

export class UpdateUserDTO extends PartialType(CreateUserDto) {}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UserSearchQueryParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  merchant?: string;

  @IsOptional()
  @IsBoolean()
  paginated?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

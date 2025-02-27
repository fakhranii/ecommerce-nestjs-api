import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import Enums from 'src/config/enums.constants';

export class CreateUserDto {
  //* Name
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must be a string' })
  @Length(3, 30, {
    message: 'Name must be at least 3 chars and at most 30 chars',
  })
  name: string;

  //* Email
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email must be a string' })
  @MinLength(3, { message: 'Email must be at least 3 chars' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  //* Password
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must be a string' })
  @Length(3, 20, {
    message: 'Password must be at least 3 chars and at most 20 chars',
  })
  password: string;

  //* Role
  @IsString({ message: 'Role must be a string' })
  @IsEnum(Object.values(Enums.Role), {
    message: 'Role must be either user or admin',
  })
  role: string;

  //* Avatar
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid url' })
  avatar: string;

  //* Phone number
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('EG', {
    message: 'Phone number must be a valid Egyptian phone number',
  })
  phoneNumber: string;

  //* Address
  @IsString({ message: 'Address must be a string' })
  address: string;

  //* Active
  @IsBoolean({ message: 'Active must be a boolean' })
  active: boolean;

  //* Verification code
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be at most 6 chars' })
  @IsOptional()
  verificationCode: string;

  //* Gender
  @IsString({ message: 'Gender must be a string' })
  @IsEnum(Object.values(Enums.Gender), {
    message: 'Gender must be either male or female',
  })
  gender: string;

  //* Age
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  @Max(100, { message: 'Age must be at most 100' })
  age: number;
}

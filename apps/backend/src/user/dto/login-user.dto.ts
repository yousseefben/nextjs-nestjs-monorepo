import { IsString, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

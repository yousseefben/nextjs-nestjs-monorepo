import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(2, 25)
  firstName: string;
  @IsString()
  @Length(2, 25)
  lastName: string;
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  password: string;
}

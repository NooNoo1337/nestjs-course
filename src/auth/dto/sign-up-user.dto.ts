import { IsString } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'El Correo electronico' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'La contraseña' })
  @MinLength(4)
  @MaxLength(12)
  password: string;
}

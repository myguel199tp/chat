/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LoginAuthDto } from './login-auth.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty({ description: 'El nombre' })
  @IsNotEmpty({ message: 'El campo nombre  es obligatorio.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'El apellido' })
  @IsNotEmpty({ message: 'El campo apellido  es obligatorio.' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'La ciudad' })
  @IsNotEmpty({ message: 'El campo ciudad  es obligatorio.' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'El telefono' })
  @IsNotEmpty({ message: 'El campo telefono  es obligatorio.' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'El correo' })
  @IsNotEmpty({ message: 'El campo correo  es obligatorio.' })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({ description: 'la contraseña' })
  @IsNotEmpty({ message: 'El campo contraseña  es obligatorio.' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'los terminos y condiciones' })
  @IsNotEmpty({ message: 'El campo terminso y condiciones es obligatorio.' })
  @IsBoolean()
  termsConditions: boolean;
}

/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  create(dto: RegisterAuthDto) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly authService: AuthService) {}

  @Get('allUser')
  findAll() {
    return this.authService.findAll();
  }

  @Get('allUser/:id')
  findOne(@Param('id') _id: string) {
    return this.authService.findOne(_id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    if (registerAuthDto.termsConditions !== true) {
      throw new BadRequestException(
        'campo terminos y condiciones es obligatorio.',
      );
    }
    if (registerAuthDto.password.length < 5) {
      throw new BadRequestException(
        'contraseña debe tener más de 5 caracteres',
      );
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!passwordRegex.test(registerAuthDto.password)) {
      throw new BadRequestException(
        'La contraseña debe contener tanto letras como números.',
      );
    }
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  async loginUser(@Body() userObjectLogin: LoginAuthDto) {
    const result = await this.authService.login(userObjectLogin);

    if (result && result.token && result.user) {
      return {
        ...result.user, // Ensure the user object contains all the necessary fields
        token: result.token, // Include the JWT token in the response
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}

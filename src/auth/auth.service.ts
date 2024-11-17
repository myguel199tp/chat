/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/users/shema/users.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    const list = await this.userModel.find({});
    return list;
  }

  async findOne(_id: string) {
    const findone = await this.userModel.findById(_id);
    return findone;
  }

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;
    const plainToHash = await hash(password, 10);
    const userWithHashedPassword = { ...userObject, password: plainToHash };

    const newUser = await this.userModel.create(userWithHashedPassword);

    return newUser;
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;

    const findUser = await this.userModel.findOne({ email });
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    const isPasswordValid = await this.comparePasswords(
      password,
      findUser.password,
    );
    if (!isPasswordValid) throw new HttpException('Contraseña incorrecta', 403);

    const token = await this.generateJwtToken(findUser);

    const user = findUser.toObject();
    delete user.password;

    return { token, user };
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  private async generateJwtToken(user: UserDocument): Promise<string> {
    const payload = { id: user._id, name: user.name };
    return this.jwtService.sign(payload);
  }

  async addSaleToUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await user.save();

    return user;
  }

  async addCommerceToUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await user.save();

    return user;
  }
}

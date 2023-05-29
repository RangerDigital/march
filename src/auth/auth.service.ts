import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { LoginUserDto } from './dto/login-user';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginUserDto) {
    // Firstly, validate the user's credentials.
    const foundUser = await this.userService.findOne(user.email, [
      'id',
      'name',
      'email',
      'password',
    ]);

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await foundUser.validatePassword(user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If the user is valid, sign the JWT with their data.
    const payload = { email: foundUser.email, id: foundUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: CreateUserDto) {
    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;

    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    user.password = hashedPassword;

    return await this.userService.create(user);
  }
}

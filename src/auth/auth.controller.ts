import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user';
import { LoginUserDto } from './dto/login-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-in')
  @UsePipes(ValidationPipe)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}

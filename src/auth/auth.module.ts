import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config';

@Module({
  imports: [
    UserModule,
    PassportModule,

    JwtModule.register({
      secret: jwtConfig.secretKey, // please change this to a secure secret in production
      signOptions: { expiresIn: '24h' }, // you might want to increase this
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

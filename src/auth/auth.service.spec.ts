import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { LoginUserDto } from './dto/login-user';
import { User } from '../user/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw an UnauthorizedException because the user does not exist', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException because the password is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const user = new User();
      user.validatePassword = jest.fn().mockResolvedValue(false);
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return an access token for a valid user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const user = new User();
      user.validatePassword = jest.fn().mockResolvedValue(true);
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const result = await authService.login(loginUserDto);
      expect(result).toEqual({ access_token: 'test_token' });
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
      };

      const mockUser = new User();
      mockUser.name = createUserDto.name;
      mockUser.email = createUserDto.email;
      mockUser.password = createUserDto.password;

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      await expect(authService.register(createUserDto)).resolves.toBeTruthy();
    });
  });
});

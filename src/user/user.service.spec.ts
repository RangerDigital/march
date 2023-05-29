import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(() => Promise.resolve(true)),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should retrieve a user with the given email', async () => {
      const testUser: User = new User();
      testUser.email = 'test@test.com';
      testUser.password = 'password';
      testUser.name = 'test';
      userRepository.findOne.mockResolvedValue(testUser);

      const foundUser = await userService.findOne('test@test.com');
      expect(foundUser).toEqual(testUser);
    });
  });

  describe('create', () => {
    let saveSpy;

    beforeEach(() => {
      saveSpy = jest.spyOn(userRepository, 'save');
    });

    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
      };
      saveSpy.mockResolvedValue(undefined);
      await userService.create(createUserDto);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@test.com',
          name: 'Test User',
        }),
      );
    });

    it('should throw a conflict exception when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
      };
      userRepository.findOne.mockResolvedValue(new User());

      try {
        await userService.create(createUserDto);
      } catch (e) {
        expect(e).toEqual(new ConflictException('Email already in use'));
      }
    });
  });
});

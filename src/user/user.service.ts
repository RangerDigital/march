import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/create-user';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(email: string, select = null): Promise<User> {
    return this.userRepository.findOne({ where: { email: email }, select });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = userDto.password;

    return this.userRepository.save(user);
  }
}

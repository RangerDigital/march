import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';
import * as bcrypt from 'bcryptjs';

import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany((type) => Task, (task) => task.user)
  tasks: Task[];

  async validatePassword(userPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
  }
}

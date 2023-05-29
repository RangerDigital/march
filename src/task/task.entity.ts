import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

import { IsNotEmpty, IsIn } from 'class-validator';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsIn(['to do', 'in progress', 'done'])
  status: string;

  @ManyToOne((type) => User, (user) => user.tasks)
  user: User;
}

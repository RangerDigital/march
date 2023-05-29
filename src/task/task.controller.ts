import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() task: Task, @Request() req): Promise<Task> {
    task.user = req.user;

    return this.taskService.create(task);
  }
}

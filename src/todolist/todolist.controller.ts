import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Todolist, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todolists')
@UseGuards(JwtAuthGuard)
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  async findAll(): Promise<Todolist[]> {
    return this.todolistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todolist | null> {
    return this.todolistService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Todolist[]> {
    return this.todolistService.findByUser(userId);
  }

  @Post()
  async create(@Body() data: Prisma.TodolistCreateInput): Promise<Todolist> {
    return this.todolistService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.TodolistUpdateInput,
  ): Promise<Todolist> {
    return this.todolistService.update(id, data);
  }

  @Patch(':id/completion')
  async updateCompletion(
    @Param('id') id: string, 
    @Body() data: { completed: boolean, percentage: number }
  ): Promise<Todolist> {
    return this.todolistService.updateCompletionStatus(id, data.completed, data.percentage);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Todolist> {
    return this.todolistService.delete(id);
  }
} 
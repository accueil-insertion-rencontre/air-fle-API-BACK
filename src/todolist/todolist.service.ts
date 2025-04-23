import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Todolist, Prisma } from '@prisma/client';

@Injectable()
export class TodolistService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Todolist[]> {
    return this.prisma.todolist.findMany({
      include: {
        user: true
      }
    });
  }

  async findOne(id: string): Promise<Todolist | null> {
    return this.prisma.todolist.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  async findByUser(userId: string): Promise<Todolist[]> {
    return this.prisma.todolist.findMany({
      where: { user_id: userId },
      include: {
        user: true
      }
    });
  }

  async create(data: Prisma.TodolistCreateInput): Promise<Todolist> {
    return this.prisma.todolist.create({
      data,
      include: {
        user: true
      }
    });
  }

  async update(id: string, data: Prisma.TodolistUpdateInput): Promise<Todolist> {
    return this.prisma.todolist.update({
      where: { id },
      data,
      include: {
        user: true
      }
    });
  }

  async updateCompletionStatus(id: string, completed: boolean, percentage: number): Promise<Todolist> {
    return this.prisma.todolist.update({
      where: { id },
      data: {
        completed,
        completionPercentage: percentage
      }
    });
  }

  async delete(id: string): Promise<Todolist> {
    return this.prisma.todolist.delete({
      where: { id },
    });
  }
} 
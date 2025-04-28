import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { Exam, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  async findAll(): Promise<Exam[]> {
    return this.examService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Exam | null> {
    return this.examService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.ExamCreateInput): Promise<Exam> {
    return this.examService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.ExamUpdateInput,
  ): Promise<Exam> {
    return this.examService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Exam> {
    return this.examService.delete(id);
  }
} 
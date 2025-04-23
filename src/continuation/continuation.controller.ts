import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContinuationService } from './continuation.service';
import { Continuation, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('continuations')
@UseGuards(JwtAuthGuard)
export class ContinuationController {
  constructor(private readonly continuationService: ContinuationService) {}

  @Get()
  async findAll(): Promise<Continuation[]> {
    return this.continuationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Continuation | null> {
    return this.continuationService.findOne(id);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string): Promise<Continuation | null> {
    return this.continuationService.findByStudent(studentId);
  }

  @Post()
  async create(@Body() data: Prisma.ContinuationCreateInput): Promise<Continuation> {
    return this.continuationService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.ContinuationUpdateInput,
  ): Promise<Continuation> {
    return this.continuationService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Continuation> {
    return this.continuationService.delete(id);
  }
} 
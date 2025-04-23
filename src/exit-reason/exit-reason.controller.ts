import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExitReasonService } from './exit-reason.service';
import { ExitReason, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exit-reasons')
@UseGuards(JwtAuthGuard)
export class ExitReasonController {
  constructor(private readonly exitReasonService: ExitReasonService) {}

  @Get()
  async findAll(): Promise<ExitReason[]> {
    return this.exitReasonService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExitReason | null> {
    return this.exitReasonService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.ExitReasonCreateInput): Promise<ExitReason> {
    return this.exitReasonService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.ExitReasonUpdateInput,
  ): Promise<ExitReason> {
    return this.exitReasonService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ExitReason> {
    return this.exitReasonService.delete(id);
  }
} 
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PeriodService } from './period.service';
import { Period, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('periods')
@UseGuards(JwtAuthGuard)
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Get()
  async findAll(): Promise<Period[]> {
    return this.periodService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Period | null> {
    return this.periodService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.PeriodCreateInput): Promise<Period> {
    return this.periodService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.PeriodUpdateInput,
  ): Promise<Period> {
    return this.periodService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Period> {
    return this.periodService.delete(id);
  }
} 
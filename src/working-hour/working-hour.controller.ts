import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WorkingHourService } from './working-hour.service';
import { WorkingHour, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('working-hours')
@UseGuards(JwtAuthGuard)
export class WorkingHourController {
  constructor(private readonly workingHourService: WorkingHourService) {}

  @Get()
  async findAll(): Promise<WorkingHour[]> {
    return this.workingHourService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkingHour | null> {
    return this.workingHourService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.WorkingHourCreateInput): Promise<WorkingHour> {
    return this.workingHourService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.WorkingHourUpdateInput,
  ): Promise<WorkingHour> {
    return this.workingHourService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<WorkingHour> {
    return this.workingHourService.delete(id);
  }
} 
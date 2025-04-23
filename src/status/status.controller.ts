import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('statuses')
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Status | null> {
    return this.statusService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.StatusCreateInput): Promise<Status> {
    return this.statusService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.StatusUpdateInput,
  ): Promise<Status> {
    return this.statusService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Status> {
    return this.statusService.delete(id);
  }
} 
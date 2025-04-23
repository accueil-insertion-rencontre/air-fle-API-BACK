import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrientationService } from './orientation.service';
import { Orientation, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orientations')
@UseGuards(JwtAuthGuard)
export class OrientationController {
  constructor(private readonly orientationService: OrientationService) {}

  @Get()
  async findAll(): Promise<Orientation[]> {
    return this.orientationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Orientation | null> {
    return this.orientationService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.OrientationCreateInput): Promise<Orientation> {
    return this.orientationService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.OrientationUpdateInput,
  ): Promise<Orientation> {
    return this.orientationService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Orientation> {
    return this.orientationService.delete(id);
  }
} 
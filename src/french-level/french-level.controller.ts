import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FrenchLevelService } from './french-level.service';
import { FrenchLevel, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('french-levels')
@UseGuards(JwtAuthGuard)
export class FrenchLevelController {
  constructor(private readonly frenchLevelService: FrenchLevelService) {}

  @Get()
  async findAll(): Promise<FrenchLevel[]> {
    return this.frenchLevelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FrenchLevel | null> {
    return this.frenchLevelService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.FrenchLevelCreateInput): Promise<FrenchLevel> {
    return this.frenchLevelService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.FrenchLevelUpdateInput,
  ): Promise<FrenchLevel> {
    return this.frenchLevelService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<FrenchLevel> {
    return this.frenchLevelService.delete(id);
  }
} 
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { Nationality, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('nationalities')
@UseGuards(JwtAuthGuard)
export class NationalityController {
  constructor(private readonly nationalityService: NationalityService) {}

  @Get()
  async findAll(): Promise<Nationality[]> {
    return this.nationalityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Nationality | null> {
    return this.nationalityService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.NationalityCreateInput): Promise<Nationality> {
    return this.nationalityService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.NationalityUpdateInput,
  ): Promise<Nationality> {
    return this.nationalityService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Nationality> {
    return this.nationalityService.delete(id);
  }
} 
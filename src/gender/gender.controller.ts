import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GenderService } from './gender.service';
import { Gender, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('genders')
@ApiBearerAuth()
@Controller('genders')
@UseGuards(JwtAuthGuard)
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  async findAll(): Promise<Gender[]> {
    return this.genderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Gender | null> {
    return this.genderService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.GenderCreateInput): Promise<Gender> {
    return this.genderService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.GenderUpdateInput,
  ): Promise<Gender> {
    return this.genderService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Gender> {
    return this.genderService.delete(id);
  }
} 
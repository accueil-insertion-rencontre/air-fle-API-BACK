import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FinancingService } from './financing.service';
import { Financing, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('financings')
@UseGuards(JwtAuthGuard)
export class FinancingController {
  constructor(private readonly financingService: FinancingService) {}

  @Get()
  async findAll(): Promise<Financing[]> {
    return this.financingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Financing | null> {
    return this.financingService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.FinancingCreateInput): Promise<Financing> {
    return this.financingService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.FinancingUpdateInput,
  ): Promise<Financing> {
    return this.financingService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Financing> {
    return this.financingService.delete(id);
  }
} 
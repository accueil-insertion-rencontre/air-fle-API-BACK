import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Address | null> {
    return this.addressService.findOne(id);
  }

  @Post()
  async create(@Body() data: Prisma.AddressCreateInput): Promise<Address> {
    return this.addressService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.AddressUpdateInput,
  ): Promise<Address> {
    return this.addressService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Address> {
    return this.addressService.delete(id);
  }
} 
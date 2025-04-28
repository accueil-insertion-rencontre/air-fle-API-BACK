import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address, Prisma } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Address[]> {
    return this.prisma.address.findMany();
  }

  async findOne(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.AddressCreateInput): Promise<Address> {
    return this.prisma.address.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Address> {
    return this.prisma.address.delete({
      where: { id },
    });
  }
} 
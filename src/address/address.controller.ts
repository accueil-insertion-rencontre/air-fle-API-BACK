import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

// DTO pour Swagger
class AddressDto {
  @ApiProperty({ description: 'Identifiant unique', example: 'abc-123' })
  id: string;

  @ApiProperty({ description: 'Rue', example: '12 rue de Paris' })
  street: string;

  @ApiProperty({ description: 'Complément d\'adresse', required: false, nullable: true, example: 'Appartement 4B' })
  complement: string | null;

  @ApiProperty({ description: 'Code postal', example: 75001, type: Number })
  @IsInt()
  @Type(() => Number)
  zipcode: number;

  @ApiProperty({ description: 'Ville', example: 'Paris' })
  city: string;

  @ApiProperty({ description: 'Quartier prioritaire de la ville', required: false, nullable: true, example: 'Centre' })
  qpv: string | null;

  @ApiProperty({ description: 'Pays', default: 'France', example: 'France' })
  country: string;
}

class AddressCreateDto {
  @ApiProperty({ description: 'Rue', example: '12 rue de Paris' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'Complément d\'adresse', required: false, nullable: true, example: 'Appartement 4B' })
  @IsString()
  @IsOptional()
  complement?: string | null;

  @ApiProperty({ description: 'Code postal', example: 75001, type: Number })
  @IsInt()
  @Type(() => Number)
  zipcode: number;

  @ApiProperty({ description: 'Ville', example: 'Paris' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Quartier prioritaire de la ville', required: false, nullable: true, example: 'Centre' })
  @IsString()
  @IsOptional()
  qpv?: string | null;

  @ApiProperty({ description: 'Pays', default: 'France', example: 'France' })
  @IsString()
  @IsOptional()
  country?: string;
}

class AddressUpdateDto {
  @ApiProperty({ description: 'Rue', required: false, example: '12 rue de Paris' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ description: 'Complément d\'adresse', required: false, nullable: true, example: 'Appartement 4B' })
  @IsString()
  @IsOptional()
  complement?: string | null;

  @ApiProperty({ description: 'Code postal', required: false, example: 75001, type: Number })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  zipcode?: number;

  @ApiProperty({ description: 'Ville', required: false, example: 'Paris' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Quartier prioritaire de la ville', required: false, nullable: true, example: 'Centre' })
  @IsString()
  @IsOptional()
  qpv?: string | null;

  @ApiProperty({ description: 'Pays', required: false, default: 'France', example: 'France' })
  @IsString()
  @IsOptional()
  country?: string;
}

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les adresses' })
  @ApiResponse({ status: 200, description: 'Retourne toutes les adresses', type: [AddressDto] })
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une adresse par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne l\'adresse', type: AddressDto })
  @ApiResponse({ status: 404, description: 'Adresse introuvable' })
  async findOne(@Param('id') id: string): Promise<Address | null> {
    return this.addressService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle adresse' })
  @ApiResponse({ status: 201, description: 'Adresse créée avec succès', type: AddressDto })
  async create(@Body() data: AddressCreateDto): Promise<Address> {

    return this.addressService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une adresse' })
  @ApiResponse({ status: 200, description: 'Adresse mise à jour avec succès', type: AddressDto })
  @ApiResponse({ status: 404, description: 'Adresse introuvable' })
  async update(
    @Param('id') id: string,
    @Body() data: AddressUpdateDto,
  ): Promise<Address> {

    return this.addressService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une adresse' })
  @ApiResponse({ status: 200, description: 'Adresse supprimée avec succès', type: AddressDto })
  @ApiResponse({ status: 404, description: 'Adresse introuvable' })
  async delete(@Param('id') id: string): Promise<Address> {
    return this.addressService.delete(id);
  }
} 
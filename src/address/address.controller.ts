import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Prisma } from '@prisma/client';

// DTO pour Swagger
class AddressDto {
  @ApiProperty({ description: 'Identifiant unique', example: 'abc-123' })
  id: string;

  @ApiProperty({ description: 'Rue', example: '12 rue de Paris' })
  street: string;

  @ApiProperty({ description: 'Complément d\'adresse', required: false, nullable: true, example: 'Appartement 4B' })
  complement: string | null;

  @ApiProperty({ description: 'Code postal', example: 75001, type: Number })
  zipcode: number;

  @ApiProperty({ description: 'Ville', example: 'Paris' })
  city: string;

  @ApiProperty({ description: 'Pays', default: 'France', example: 'France' })
  country: string;
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
  @ApiParam({ name: 'id', description: 'ID de l\'adresse' })
  async findOne(@Param('id') id: string): Promise<Address | null> {
    return this.addressService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle adresse' })
  @ApiResponse({ status: 201, description: 'Adresse créée avec succès', type: AddressDto })
  @ApiBody({ type: CreateAddressDto })
  async create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.AddressCreateInput = {
      street: createAddressDto.street,
      complement: createAddressDto.complement,
      zipcode: createAddressDto.zipcode,
      city: createAddressDto.city,
      country: createAddressDto.country || 'France'
    };
    
    return this.addressService.create(prismaData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une adresse' })
  @ApiResponse({ status: 200, description: 'Adresse mise à jour avec succès', type: AddressDto })
  @ApiResponse({ status: 404, description: 'Adresse introuvable' })
  @ApiParam({ name: 'id', description: 'ID de l\'adresse' })
  @ApiBody({ type: UpdateAddressDto })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.AddressUpdateInput = {};
    
    if (updateAddressDto.street !== undefined) prismaData.street = updateAddressDto.street;
    if (updateAddressDto.complement !== undefined) prismaData.complement = updateAddressDto.complement;
    if (updateAddressDto.zipcode !== undefined) prismaData.zipcode = updateAddressDto.zipcode;
    if (updateAddressDto.city !== undefined) prismaData.city = updateAddressDto.city;
    if (updateAddressDto.country !== undefined) prismaData.country = updateAddressDto.country;
    
    return this.addressService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une adresse' })
  @ApiResponse({ status: 200, description: 'Adresse supprimée avec succès', type: AddressDto })
  @ApiResponse({ status: 404, description: 'Adresse introuvable' })
  @ApiParam({ name: 'id', description: 'ID de l\'adresse' })
  async delete(@Param('id') id: string): Promise<Address> {
    return this.addressService.delete(id);
  }
} 
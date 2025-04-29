import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GenderService } from './gender.service';
import { Gender } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Prisma } from '@prisma/client';

@ApiTags('genders')
@ApiBearerAuth()
@Controller('genders')
@UseGuards(JwtAuthGuard)
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les genres' })
  @ApiResponse({ status: 200, description: 'Liste des genres récupérée avec succès' })
  async findAll(): Promise<Gender[]> {
    return this.genderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un genre par ID' })
  @ApiResponse({ status: 200, description: 'Genre récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Genre non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du genre' })
  async findOne(@Param('id') id: string): Promise<Gender | null> {
    return this.genderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un genre' })
  @ApiResponse({ status: 201, description: 'Genre créé avec succès' })
  @ApiBody({ type: CreateGenderDto })
  async create(@Body() createGenderDto: CreateGenderDto): Promise<Gender> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.GenderCreateInput = {
      label: createGenderDto.label
    };
    
    return this.genderService.create(prismaData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un genre' })
  @ApiResponse({ status: 200, description: 'Genre mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Genre non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du genre' })
  @ApiBody({ type: UpdateGenderDto })
  async update(
    @Param('id') id: string,
    @Body() updateGenderDto: UpdateGenderDto,
  ): Promise<Gender> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.GenderUpdateInput = {};
    
    if (updateGenderDto.label !== undefined) {
      prismaData.label = updateGenderDto.label;
    }
    
    return this.genderService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un genre' })
  @ApiResponse({ status: 200, description: 'Genre supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Genre non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du genre' })
  async delete(@Param('id') id: string): Promise<Gender> {
    return this.genderService.delete(id);
  }
} 
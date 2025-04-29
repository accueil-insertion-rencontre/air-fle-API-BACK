import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FrenchLevelService } from './french-level.service';
import { FrenchLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFrenchLevelDto } from './dto/create-french-level.dto';
import { UpdateFrenchLevelDto } from './dto/update-french-level.dto';

@ApiTags('french-levels')
@ApiBearerAuth()
@Controller('french-levels')
@UseGuards(JwtAuthGuard)
export class FrenchLevelController {
  constructor(private readonly frenchLevelService: FrenchLevelService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les niveaux de français' })
  @ApiResponse({ status: 200, description: 'Liste des niveaux de français récupérée avec succès' })
  async findAll(): Promise<FrenchLevel[]> {
    return this.frenchLevelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un niveau de français par ID' })
  @ApiResponse({ status: 200, description: 'Niveau de français récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Niveau de français non trouvé' })
  async findOne(@Param('id') id: string): Promise<FrenchLevel | null> {
    return this.frenchLevelService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un niveau de français' })
  @ApiResponse({ status: 201, description: 'Niveau de français créé avec succès' })
  async create(@Body() data: CreateFrenchLevelDto): Promise<FrenchLevel> {
    return this.frenchLevelService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un niveau de français' })
  @ApiResponse({ status: 200, description: 'Niveau de français mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Niveau de français non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFrenchLevelDto,
  ): Promise<FrenchLevel> {
    return this.frenchLevelService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un niveau de français' })
  @ApiResponse({ status: 200, description: 'Niveau de français supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Niveau de français non trouvé' })
  async delete(@Param('id') id: string): Promise<FrenchLevel> {
    return this.frenchLevelService.delete(id);
  }
} 
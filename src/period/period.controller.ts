import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PeriodService } from './period.service';
import { Period } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@ApiTags('periods')
@ApiBearerAuth()
@Controller('periods')
@UseGuards(JwtAuthGuard)
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les périodes' })
  @ApiResponse({ status: 200, description: 'Liste des périodes récupérée avec succès' })
  async findAll(): Promise<Period[]> {
    return this.periodService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une période par ID' })
  @ApiResponse({ status: 200, description: 'Période récupérée avec succès' })
  @ApiResponse({ status: 404, description: 'Période non trouvée' })
  async findOne(@Param('id') id: string): Promise<Period | null> {
    return this.periodService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une période' })
  @ApiResponse({ status: 201, description: 'Période créée avec succès' })
  async create(@Body() data: CreatePeriodDto): Promise<Period> {
    return this.periodService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une période' })
  @ApiResponse({ status: 200, description: 'Période mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Période non trouvée' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePeriodDto,
  ): Promise<Period> {
    return this.periodService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une période' })
  @ApiResponse({ status: 200, description: 'Période supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Période non trouvée' })
  async delete(@Param('id') id: string): Promise<Period> {
    return this.periodService.delete(id);
  }
} 
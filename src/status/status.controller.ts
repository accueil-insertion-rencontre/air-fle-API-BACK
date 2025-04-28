import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('statuses')
@ApiBearerAuth()
@Controller('statuses')
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les statuts' })
  @ApiResponse({ status: 200, description: 'Liste des statuts récupérée avec succès' })
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un statut par ID' })
  @ApiResponse({ status: 200, description: 'Statut récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé' })
  async findOne(@Param('id') id: string): Promise<Status | null> {
    return this.statusService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un statut' })
  @ApiResponse({ status: 201, description: 'Statut créé avec succès' })
  async create(@Body() data: CreateStatusDto): Promise<Status> {
    return this.statusService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un statut' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStatusDto,
  ): Promise<Status> {
    return this.statusService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un statut' })
  @ApiResponse({ status: 200, description: 'Statut supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé' })
  async delete(@Param('id') id: string): Promise<Status> {
    return this.statusService.delete(id);
  }
} 
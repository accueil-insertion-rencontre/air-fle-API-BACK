import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { Nationality } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNationalityDto } from './dto/create-nationality.dto';
import { UpdateNationalityDto } from './dto/update-nationality.dto';

@ApiTags('nationalities')
@ApiBearerAuth()
@Controller('nationalities')
@UseGuards(JwtAuthGuard)
export class NationalityController {
  constructor(private readonly nationalityService: NationalityService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les nationalités' })
  @ApiResponse({ status: 200, description: 'Liste des nationalités récupérée avec succès' })
  async findAll(): Promise<Nationality[]> {
    return this.nationalityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une nationalité par ID' })
  @ApiResponse({ status: 200, description: 'Nationalité récupérée avec succès' })
  @ApiResponse({ status: 404, description: 'Nationalité non trouvée' })
  async findOne(@Param('id') id: string): Promise<Nationality | null> {
    return this.nationalityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nationalité' })
  @ApiResponse({ status: 201, description: 'Nationalité créée avec succès' })
  async create(@Body() data: CreateNationalityDto): Promise<Nationality> {
    return this.nationalityService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une nationalité' })
  @ApiResponse({ status: 200, description: 'Nationalité mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Nationalité non trouvée' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateNationalityDto,
  ): Promise<Nationality> {
    return this.nationalityService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une nationalité' })
  @ApiResponse({ status: 200, description: 'Nationalité supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Nationalité non trouvée' })
  async delete(@Param('id') id: string): Promise<Nationality> {
    return this.nationalityService.delete(id);
  }
} 
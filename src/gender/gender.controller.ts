import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GenderService } from './gender.service';
import { Gender } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

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
  async findOne(@Param('id') id: string): Promise<Gender | null> {
    return this.genderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un genre' })
  @ApiResponse({ status: 201, description: 'Genre créé avec succès' })
  async create(@Body() data: CreateGenderDto): Promise<Gender> {
    return this.genderService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un genre' })
  @ApiResponse({ status: 200, description: 'Genre mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Genre non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateGenderDto,
  ): Promise<Gender> {
    return this.genderService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un genre' })
  @ApiResponse({ status: 200, description: 'Genre supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Genre non trouvé' })
  async delete(@Param('id') id: string): Promise<Gender> {
    return this.genderService.delete(id);
  }
} 
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrientationService } from './orientation.service';
import { Orientation } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateOrientationDto } from './dto/create-orientation.dto';
import { UpdateOrientationDto } from './dto/update-orientation.dto';
import { Prisma } from '@prisma/client';

@ApiTags('orientations')
@ApiBearerAuth()
@Controller('orientations')
@UseGuards(JwtAuthGuard)
export class OrientationController {
  constructor(private readonly orientationService: OrientationService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les orientations' })
  @ApiResponse({ status: 200, description: 'Liste des orientations récupérée avec succès' })
  async findAll(): Promise<Orientation[]> {
    return this.orientationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une orientation par ID' })
  @ApiResponse({ status: 200, description: 'Orientation récupérée avec succès' })
  @ApiResponse({ status: 404, description: 'Orientation non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de l\'orientation' })
  async findOne(@Param('id') id: string): Promise<Orientation | null> {
    return this.orientationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une orientation' })
  @ApiResponse({ status: 201, description: 'Orientation créée avec succès' })
  @ApiBody({ type: CreateOrientationDto })
  async create(@Body() createOrientationDto: CreateOrientationDto): Promise<Orientation> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.OrientationCreateInput = {
      type: createOrientationDto.type,
      description: createOrientationDto.description
    };
    
    return this.orientationService.create(prismaData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une orientation' })
  @ApiResponse({ status: 200, description: 'Orientation mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Orientation non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de l\'orientation' })
  @ApiBody({ type: UpdateOrientationDto })
  async update(
    @Param('id') id: string,
    @Body() updateOrientationDto: UpdateOrientationDto,
  ): Promise<Orientation> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.OrientationUpdateInput = {};
    
    if (updateOrientationDto.type !== undefined) {
      prismaData.type = updateOrientationDto.type;
    }
    
    if (updateOrientationDto.description !== undefined) {
      prismaData.description = updateOrientationDto.description;
    }
    
    return this.orientationService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une orientation' })
  @ApiResponse({ status: 200, description: 'Orientation supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Orientation non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de l\'orientation' })
  async delete(@Param('id') id: string): Promise<Orientation> {
    return this.orientationService.delete(id);
  }
} 
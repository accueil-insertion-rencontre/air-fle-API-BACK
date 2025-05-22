import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { DisabilityService } from './disability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateDisabilityDto } from './dto/create-disability.dto';
import { UpdateDisabilityDto } from './dto/update-disability.dto';

// DTO pour la documentation Swagger
class DisabilityDto {
  id: string;
  label: string;
  description?: string;
}

@ApiTags('disabilities')
@ApiBearerAuth()
@Controller('disabilities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisabilityController {
  constructor(private readonly disabilityService: DisabilityService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Récupérer tous les types de handicap' })
  @ApiResponse({ status: 200, description: 'Retourne tous les types de handicap', type: [DisabilityDto] })
  async findAll() {
    return this.disabilityService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Récupérer un type de handicap par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne le type de handicap spécifié', type: DisabilityDto })
  @ApiResponse({ status: 404, description: 'Type de handicap non trouvé' })
  @ApiParam({ name: 'id', description: 'Identifiant du type de handicap', example: 'abc123' })
  async findOne(@Param('id') id: string) {
    return this.disabilityService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un nouveau type de handicap' })
  @ApiResponse({ status: 201, description: 'Type de handicap créé avec succès', type: DisabilityDto })
  @ApiBody({ type: CreateDisabilityDto })
  async create(@Body() createDisabilityDto: CreateDisabilityDto) {
    return this.disabilityService.create(createDisabilityDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Mettre à jour un type de handicap' })
  @ApiResponse({ status: 200, description: 'Type de handicap mis à jour avec succès', type: DisabilityDto })
  @ApiResponse({ status: 404, description: 'Type de handicap non trouvé' })
  @ApiParam({ name: 'id', description: 'Identifiant du type de handicap', example: 'abc123' })
  @ApiBody({ type: UpdateDisabilityDto })
  async update(@Param('id') id: string, @Body() updateDisabilityDto: UpdateDisabilityDto) {
    return this.disabilityService.update(id, updateDisabilityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un type de handicap' })
  @ApiResponse({ status: 200, description: 'Type de handicap supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Type de handicap non trouvé' })
  @ApiParam({ name: 'id', description: 'Identifiant du type de handicap', example: 'abc123' })
  async remove(@Param('id') id: string) {
    return this.disabilityService.remove(id);
  }
}

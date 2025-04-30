import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FinancingService } from './financing.service';
import { Financing } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateFinancingDto } from './dto/create-financing.dto';
import { UpdateFinancingDto } from './dto/update-financing.dto';
import { Prisma } from '@prisma/client';

@ApiTags('financings')
@ApiBearerAuth()
@Controller('financings')
@UseGuards(JwtAuthGuard)
export class FinancingController {
  constructor(private readonly financingService: FinancingService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les types de financement' })
  @ApiResponse({ status: 200, description: 'Liste des financements récupérée avec succès' })
  async findAll(): Promise<Financing[]> {
    return this.financingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un type de financement par ID' })
  @ApiResponse({ status: 200, description: 'Financement récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Financement non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du financement' })
  async findOne(@Param('id') id: string): Promise<Financing | null> {
    return this.financingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau type de financement' })
  @ApiResponse({ status: 201, description: 'Financement créé avec succès' })
  @ApiBody({ type: CreateFinancingDto })
  async create(@Body() createFinancingDto: CreateFinancingDto): Promise<Financing> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.FinancingCreateInput = {
      type: createFinancingDto.type
    };
    
    return this.financingService.create(prismaData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un type de financement' })
  @ApiResponse({ status: 200, description: 'Financement mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Financement non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du financement' })
  @ApiBody({ type: UpdateFinancingDto })
  async update(
    @Param('id') id: string,
    @Body() updateFinancingDto: UpdateFinancingDto,
  ): Promise<Financing> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.FinancingUpdateInput = {
      type: updateFinancingDto.type
    };
    
    return this.financingService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un type de financement' })
  @ApiResponse({ status: 200, description: 'Financement supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Financement non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du financement' })
  async delete(@Param('id') id: string): Promise<Financing> {
    return this.financingService.delete(id);
  }
} 
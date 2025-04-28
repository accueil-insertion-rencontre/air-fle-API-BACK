import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Todolist } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';

@ApiTags('todolists')
@ApiBearerAuth()
@Controller('todolists')
@UseGuards(JwtAuthGuard)
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une tâche' })
  @ApiResponse({ status: 201, description: 'Tâche créée avec succès' })
  async create(@Body() createTodolistDto: CreateTodolistDto): Promise<Todolist> {
    // Convertir le DTO en format compatible avec Prisma
    const prismaData = {
      title: createTodolistDto.title,
      description: createTodolistDto.description,
      completionPercentage: createTodolistDto.completionPercentage,
      dueAt: createTodolistDto.dueAt,
      user: {
        connect: {
          id: createTodolistDto.user_id
        }
      }
    };
    
    return this.todolistService.create(prismaData);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les tâches' })
  @ApiResponse({ status: 200, description: 'Liste des tâches récupérée avec succès' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrer par utilisateur' })
  async findAll(@Query('userId') userId?: string): Promise<Todolist[]> {
    if (userId) {
      return this.todolistService.findByUser(userId);
    }
    return this.todolistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une tâche par ID' })
  @ApiResponse({ status: 200, description: 'Tâche récupérée avec succès' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  async findOne(@Param('id') id: string): Promise<Todolist | null> {
    return this.todolistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une tâche' })
  @ApiResponse({ status: 200, description: 'Tâche mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  async update(
    @Param('id') id: string,
    @Body() updateTodolistDto: UpdateTodolistDto,
  ): Promise<Todolist> {
    const prismaData: any = { ...updateTodolistDto };
    
    // Si user_id est fourni, le transformer en relation Prisma
    if (updateTodolistDto.user_id) {
      delete prismaData.user_id;
      prismaData.user = {
        connect: {
          id: updateTodolistDto.user_id
        }
      };
    }
    
    return this.todolistService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une tâche' })
  @ApiResponse({ status: 200, description: 'Tâche supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  async remove(@Param('id') id: string): Promise<Todolist> {
    return this.todolistService.delete(id);
  }
} 
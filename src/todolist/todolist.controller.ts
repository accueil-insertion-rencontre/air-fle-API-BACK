import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Todolist, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('todolists')
@ApiBearerAuth()
@Controller('todolists')
@UseGuards(JwtAuthGuard)
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les todolists' })
  @ApiResponse({ status: 200, description: 'Retourne toutes les todolists' })
  async findAll(): Promise<Todolist[]> {
    return this.todolistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une todolist par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne la todolist' })
  @ApiResponse({ status: 404, description: 'Todolist introuvable' })
  async findOne(@Param('id') id: string): Promise<Todolist | null> {
    return this.todolistService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les todolists d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Retourne les todolists de l\'utilisateur' })
  async findByUser(@Param('userId') userId: string): Promise<Todolist[]> {
    return this.todolistService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle todolist' })
  @ApiResponse({ status: 201, description: 'Todolist créée avec succès' })
  async create(@Body() data: Prisma.TodolistCreateInput): Promise<Todolist> {
    return this.todolistService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une todolist' })
  @ApiResponse({ status: 200, description: 'Todolist mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Todolist introuvable' })
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.TodolistUpdateInput,
  ): Promise<Todolist> {
    return this.todolistService.update(id, data);
  }

  @Patch(':id/completion')
  @ApiOperation({ summary: 'Mettre à jour le pourcentage de complétion d\'une todolist' })
  @ApiResponse({ status: 200, description: 'Statut de complétion mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Todolist introuvable' })
  async updateCompletion(
    @Param('id') id: string, 
    @Body() data: { percentage: number }
  ): Promise<Todolist> {
    return this.todolistService.updateCompletionStatus(id, data.percentage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une todolist' })
  @ApiResponse({ status: 200, description: 'Todolist supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Todolist introuvable' })
  async delete(@Param('id') id: string): Promise<Todolist> {
    return this.todolistService.delete(id);
  }
} 
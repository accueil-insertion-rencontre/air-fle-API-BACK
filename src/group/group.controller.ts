import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

// Pour éviter l'erreur d'import de UserRole
type UserRole = 'admin' | 'teacher';
const UserRole: Record<string, UserRole> = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
};

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Créer un groupe' })
  @ApiResponse({ status: 201, description: 'Groupe créé avec succès' })
  async create(@Body() createGroupDto: CreateGroupDto) {
    // Convertir le DTO en format compatible avec Prisma
    const prismaData = {
      label: createGroupDto.label,
      session: {
        connect: {
          id: createGroupDto.session_id
        }
      }
    };
    
    return this.groupService.create(prismaData);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les groupes' })
  @ApiResponse({ status: 200, description: 'Liste des groupes récupérée avec succès' })
  @ApiQuery({ name: 'sessionId', required: false, description: 'Filtrer par session' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Filtrer par période' })
  async findAll(
    @Query('sessionId') sessionId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const where: any = {};
    
    if (sessionId) {
      where.session_id = sessionId;
    }
    
    if (periodId) {
      where.periods = {
        some: {
          period_id: periodId
        }
      };
    }
    
    return this.groupService.findAll({ where });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un groupe par ID' })
  @ApiResponse({ status: 200, description: 'Groupe récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Mettre à jour un groupe' })
  @ApiResponse({ status: 200, description: 'Groupe mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const prismaData: any = { ...updateGroupDto };
    
    // Si session_id est fourni, le transformer en relation Prisma
    if (updateGroupDto.session_id) {
      delete prismaData.session_id;
      prismaData.session = {
        connect: {
          id: updateGroupDto.session_id
        }
      };
    }
    
    return this.groupService.update(id, prismaData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un groupe' })
  @ApiResponse({ status: 200, description: 'Groupe supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':id/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Ajouter un étudiant au groupe' })
  @ApiResponse({ status: 200, description: 'Étudiant ajouté avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe ou étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  @ApiParam({ name: 'studentId', description: 'ID de l\'étudiant' })
  async addStudent(
    @Param('id') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.groupService.addStudent(groupId, studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Retirer un étudiant du groupe' })
  @ApiResponse({ status: 200, description: 'Étudiant retiré avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe ou étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  @ApiParam({ name: 'studentId', description: 'ID de l\'étudiant' })
  async removeStudent(
    @Param('id') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.groupService.removeStudent(groupId, studentId);
  }
}

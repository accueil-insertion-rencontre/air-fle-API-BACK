import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma } from '@prisma/client';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Créer un groupe' })
  @ApiResponse({ status: 201, description: 'Groupe créé avec succès' })
  @ApiBody({ type: CreateGroupDto })
  async create(@Body() createGroupDto: CreateGroupDto) {
    const prismaData: Prisma.GroupCreateInput = {
      group_label: createGroupDto.group_label,
      session: {
        connect: {
          session_uuid: createGroupDto.session_uuid,
        },
      },
    };

    return this.groupService.create(prismaData);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les groupes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des groupes récupérée avec succès',
  })
  @ApiQuery({
    name: 'session_uuid',
    required: false,
    description: 'Filtrer par session',
  })
  @ApiQuery({
    name: 'period_uuid',
    required: false,
    description: 'Filtrer par période',
  })
  async findAll(
    @Query('session_uuid') session_uuid?: string,
    @Query('period_uuid') period_uuid?: string,
  ) {
    const where: Prisma.GroupWhereInput = {};

    if (session_uuid) {
      where.session_uuid = session_uuid;
    }

    if (period_uuid) {
      where.periods = {
        some: {
          period_uuid: period_uuid,
        },
      };
    }

    return this.groupService.findAll({ where });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un groupe par ID' })
  @ApiResponse({ status: 200, description: 'Groupe récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'UUID du groupe' })
  async findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Mettre à jour un groupe' })
  @ApiResponse({ status: 200, description: 'Groupe mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'UUID du groupe' })
  @ApiBody({ type: UpdateGroupDto })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const prismaData: Prisma.GroupUpdateInput = {};

    if (updateGroupDto.group_label !== undefined) {
      prismaData.group_label = updateGroupDto.group_label;
    }

    if (updateGroupDto.session_uuid) {
      prismaData.session = {
        connect: {
          session_uuid: updateGroupDto.session_uuid,
        },
      };
    }

    return this.groupService.update(id, prismaData);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un groupe' })
  @ApiResponse({ status: 200, description: 'Groupe supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe non trouvé' })
  @ApiParam({ name: 'id', description: 'UUID du groupe' })
  async remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':id/students/:student_uuid')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Ajouter un étudiant au groupe' })
  @ApiResponse({ status: 200, description: 'Étudiant ajouté avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe ou étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'UUID du groupe' })
  @ApiParam({ name: 'student_uuid', description: "UUID de l'étudiant" })
  async addStudent(
    @Param('id') groupId: string,
    @Param('student_uuid') student_uuid: string,
  ) {
    return this.groupService.addStudent(groupId, student_uuid);
  }

  @Delete(':id/students/:student_uuid')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Retirer un étudiant du groupe' })
  @ApiResponse({ status: 200, description: 'Étudiant retiré avec succès' })
  @ApiResponse({ status: 404, description: 'Groupe ou étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'UUID du groupe' })
  @ApiParam({ name: 'student_uuid', description: "UUID de l'étudiant" })
  async removeStudent(
    @Param('id') groupId: string,
    @Param('student_uuid') student_uuid: string,
  ) {
    return this.groupService.removeStudent(groupId, student_uuid);
  }
}

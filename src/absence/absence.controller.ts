import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody, ApiProperty } from '@nestjs/swagger';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';

// DTO pour la réponse Swagger
class AbsenceDto {
  @ApiProperty({ description: 'Identifiant unique', example: 'abc123' })
  id: string;

  @ApiProperty({ description: 'Identifiant de l\'étudiant', example: 'def456' })
  student_id: string;

  @ApiProperty({ description: 'Identifiant du cours', example: 'ghi789' })
  course_id: string;

  @ApiProperty({ description: 'Raison de l\'absence', required: false, example: 'Maladie' })
  reason?: string;
}

@ApiTags('absences')
@ApiBearerAuth()
@Controller('absences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Créer une nouvelle absence' })
  @ApiResponse({ status: 201, description: 'Absence créée avec succès', type: AbsenceDto })
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    // Transformer le DTO d'API en Input pour Prisma
    const createAbsenceData: Prisma.AbsenceCreateInput = {
      student: { connect: { id: createAbsenceDto.student_id } },
      course: { connect: { course_id: createAbsenceDto.course_id } },
      reason: createAbsenceDto.reason
    };
    
    return this.absenceService.create(createAbsenceData);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Récupérer toutes les absences avec possibilité de filtrage' })
  @ApiResponse({ status: 200, description: 'Liste des absences', type: [AbsenceDto] })
  @ApiQuery({ name: 'skip', required: false, description: 'Nombre d\'éléments à sauter' })
  @ApiQuery({ name: 'take', required: false, description: 'Nombre d\'éléments à récupérer' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Filtrer par identifiant étudiant' })
  @ApiQuery({ name: 'courseId', required: false, description: 'Filtrer par identifiant de cours' })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    const where: Prisma.AbsenceWhereInput = {};
    
    if (studentId) {
      where.student_id = studentId;
    }
    
    if (courseId) {
      where.course_id = courseId;
    }
    
    return this.absenceService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
    }).then(result => {
      // Transformer les résultats pour l'API
      const transformedData = result.data.map(absence => ({
        id: absence.id,
        student_id: absence.student_id,
        course_id: absence.course_id,
        reason: absence.reason,
        // Inclure d'autres propriétés nécessaires
        student: absence.student,
        course: absence.course
      }));
      
      return {
        data: transformedData,
        meta: result.meta
      };
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Récupérer une absence par son identifiant' })
  @ApiResponse({ status: 200, description: 'Absence trouvée', type: AbsenceDto })
  @ApiResponse({ status: 404, description: 'Absence introuvable' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'absence', example: 'abc123' })
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(id).then(absence => {
      // Transformer le résultat pour l'API
      return {
        id: absence.id,
        student_id: absence.student_id,
        course_id: absence.course_id,
        reason: absence.reason,
        // Inclure d'autres propriétés nécessaires
        student: absence.student,
        course: absence.course
      };
    });
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Mettre à jour une absence' })
  @ApiResponse({ status: 200, description: 'Absence mise à jour avec succès', type: AbsenceDto })
  @ApiResponse({ status: 404, description: 'Absence introuvable' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'absence', example: 'abc123' })
  update(
    @Param('id') id: string,
    @Body() updateAbsenceDto: UpdateAbsenceDto,
  ) {
    // Transformer le DTO d'API en Input pour Prisma
    const updateAbsenceData: Prisma.AbsenceUpdateInput = {};
    
    if (updateAbsenceDto.reason !== undefined) {
      updateAbsenceData.reason = updateAbsenceDto.reason;
    }
    
    if (updateAbsenceDto.student_id) {
      updateAbsenceData.student = { connect: { id: updateAbsenceDto.student_id } };
    }
    
    if (updateAbsenceDto.course_id) {
      updateAbsenceData.course = { connect: { course_id: updateAbsenceDto.course_id } };
    }
    
    return this.absenceService.update(id, updateAbsenceData).then(absence => {
      // Transformer le résultat pour l'API
      return {
        id: absence.id,
        student_id: absence.student_id,
        course_id: absence.course_id,
        reason: absence.reason,
        // Inclure d'autres propriétés nécessaires
        student: absence.student,
        course: absence.course
      };
    });
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer une absence' })
  @ApiResponse({ status: 200, description: 'Absence supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Absence introuvable' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'absence', example: 'abc123' })
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}

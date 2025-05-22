import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
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
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
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
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer toutes les absences' })
  @ApiResponse({ status: 200, description: 'Retourne toutes les absences', type: [AbsenceDto] })
  async findAll() {
    return this.absenceService.findAll({});
  }

  @Get(':id')
  @Roles('admin', 'teacher')
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
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Mettre à jour une absence' })
  @ApiResponse({ status: 200, description: 'Absence mise à jour avec succès', type: AbsenceDto })
  @ApiResponse({ status: 404, description: 'Absence non trouvée' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'absence', example: 'abc123' })
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
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
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Supprimer une absence' })
  @ApiResponse({ status: 200, description: 'Absence supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Absence non trouvée' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'absence', example: 'abc123' })
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}

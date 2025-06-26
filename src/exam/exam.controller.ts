import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('exams')
@ApiBearerAuth()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer tous les examens' })
  @ApiResponse({
    status: 200,
    description: 'Liste des examens récupérée avec succès',
  })
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer un examen par ID' })
  @ApiResponse({ status: 200, description: 'Examen récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: "UUID de l'examen" })
  findOne(@Param('id') id: string) {
    return this.examService.findOne(id);
  }

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Créer un nouvel examen' })
  @ApiResponse({ status: 201, description: 'Examen créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiBody({ type: CreateExamDto })
  create(@Body() createExamDto: CreateExamDto) {
    const examData: Prisma.ExamCreateInput = {
      exam_label: createExamDto.exam_label,
      exam_taked_at: createExamDto.exam_taked_at,
      exam_score: createExamDto.exam_score,
      student: {
        connect: {
          student_uuid: createExamDto.student_uuid,
        },
      },
    };

    return this.examService.create(examData);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Mettre à jour un examen' })
  @ApiResponse({ status: 200, description: 'Examen mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: "UUID de l'examen" })
  @ApiBody({ type: UpdateExamDto })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    const prismaData: Prisma.ExamUpdateInput = {};

    if (updateExamDto.exam_label !== undefined)
      prismaData.exam_label = updateExamDto.exam_label;
    if (updateExamDto.exam_taked_at !== undefined)
      prismaData.exam_taked_at = updateExamDto.exam_taked_at;
    if (updateExamDto.exam_score !== undefined)
      prismaData.exam_score = updateExamDto.exam_score;

    if (updateExamDto.student_uuid) {
      prismaData.student = {
        connect: {
          student_uuid: updateExamDto.student_uuid,
        },
      };
    }

    return this.examService.update(id, prismaData);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un examen' })
  @ApiResponse({ status: 200, description: 'Examen supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: "UUID de l'examen" })
  remove(@Param('id') id: string) {
    return this.examService.delete(id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { Exam } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Prisma } from '@prisma/client';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les examens' })
  @ApiResponse({ status: 200, description: 'Liste des examens récupérée avec succès' })
  async findAll(): Promise<Exam[]> {
    return this.examService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un examen par ID' })
  @ApiResponse({ status: 200, description: 'Examen récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'examen' })
  async findOne(@Param('id') id: string): Promise<Exam | null> {
    return this.examService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel examen' })
  @ApiResponse({ status: 201, description: 'Examen créé avec succès' })
  @ApiBody({ type: CreateExamDto })
  async create(@Body() createExamDto: CreateExamDto): Promise<Exam> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.ExamCreateInput = {
      label: createExamDto.label,
      taked_at: createExamDto.taked_at,
      note: createExamDto.note,
      student: {
        connect: {
          id: createExamDto.student_id
        }
      }
    };
    
    return this.examService.create(prismaData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un examen' })
  @ApiResponse({ status: 200, description: 'Examen mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'examen' })
  @ApiBody({ type: UpdateExamDto })
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    // Conversion du DTO en format Prisma
    const prismaData: Prisma.ExamUpdateInput = {};
    
    if (updateExamDto.label !== undefined) prismaData.label = updateExamDto.label;
    if (updateExamDto.taked_at !== undefined) prismaData.taked_at = updateExamDto.taked_at;
    if (updateExamDto.note !== undefined) prismaData.note = updateExamDto.note;
    
    if (updateExamDto.student_id) {
      prismaData.student = {
        connect: {
          id: updateExamDto.student_id
        }
      };
    }
    
    return this.examService.update(id, prismaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un examen' })
  @ApiResponse({ status: 200, description: 'Examen supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Examen non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'examen' })
  async delete(@Param('id') id: string): Promise<Exam> {
    return this.examService.delete(id);
  }
} 
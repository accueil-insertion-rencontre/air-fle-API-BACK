import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Prisma, Student } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentDisabilityDto } from './dto/student-disability.dto';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Créer un étudiant' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Étudiant créé avec succès' })
  @ApiBody({ type: CreateStudentDto })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer tous les étudiants' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste des étudiants récupérée avec succès' })
  @ApiQuery({ name: 'skip', required: false, description: 'Nombre d\'éléments à sauter' })
  @ApiQuery({ name: 'take', required: false, description: 'Nombre d\'éléments à prendre' })
  @ApiQuery({ name: 'orderBy', required: false, description: 'Tri des résultats (JSON)' })
  @ApiQuery({ name: 'firstname', required: false, description: 'Filtre sur le prénom' })
  @ApiQuery({ name: 'lastname', required: false, description: 'Filtre sur le nom' })
  @ApiQuery({ name: 'email', required: false, description: 'Filtre sur l\'email' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
    @Query('firstname') firstname?: string,
    @Query('lastname') lastname?: string,
    @Query('email') email?: string,
  ): Promise<Student[]> {
    const where: Prisma.StudentWhereInput = {};

    if (firstname) {
      where.firstname = { contains: firstname, mode: 'insensitive' };
    }

    if (lastname) {
      where.lastname = { contains: lastname, mode: 'insensitive' };
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    return this.studentService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: orderBy
        ? JSON.parse(orderBy)
        : { createdAt: 'desc' as const },
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer un étudiant par ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Étudiant récupéré avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  async findOne(@Param('id') id: string): Promise<Student> {
    const student = await this.studentService.findOne({ id });
    
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }
    
    return student;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Mettre à jour un étudiant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Étudiant mis à jour avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  @ApiBody({ type: UpdateStudentDto })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      return await this.studentService.update({
        where: { id },
        data: updateStudentDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Supprimer un étudiant' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Étudiant supprimé avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Étudiant non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.studentService.remove({ id });
      return;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  @Post(':id/disabilities')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Associer des handicaps à un étudiant' })
  @ApiResponse({ status: 200, description: 'Handicaps associés avec succès' })
  @ApiResponse({ status: 404, description: 'Étudiant introuvable' })
  @ApiParam({ name: 'id', description: 'Identifiant de l\'étudiant', example: 'abc123' })
  @ApiBody({ type: StudentDisabilityDto })
  async updateStudentDisabilities(
    @Param('id') id: string,
    @Body() studentDisabilityDto: StudentDisabilityDto
  ) {
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }
    
    await this.studentService.updateStudentDisabilities(id, studentDisabilityDto.disability_ids);
    return { success: true, message: 'Handicaps associés avec succès' };
  }
} 
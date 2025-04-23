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
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Type par défaut pour corriger les problèmes de linter
type Student = any;
type PrismaTypes = typeof PrismaClient.prototype;

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  async create(@Body() data: any) {
    return this.studentService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
    @Query('firstname') firstname?: string,
    @Query('lastname') lastname?: string,
    @Query('email') email?: string,
  ) {
    const where: any = {};

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
  async findOne(@Param('id') id: string) {
    const student = await this.studentService.findOne({ id });
    
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }
    
    return student;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    try {
      return await this.studentService.update({
        where: { id },
        data,
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
  @Roles('admin')
  async remove(@Param('id') id: string) {
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
} 
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('absences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  create(@Body() createAbsenceData: Prisma.AbsenceCreateInput) {
    return this.absenceService.create(createAbsenceData);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
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
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  update(
    @Param('id') id: string,
    @Body() updateAbsenceData: Prisma.AbsenceUpdateInput,
  ) {
    return this.absenceService.update(id, updateAbsenceData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}

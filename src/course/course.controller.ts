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
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  async create(@Body() createCourseData: any) {
    return this.courseService.create(createCourseData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
    @Query('title') title?: string,
    @Query('teacher') teacher?: string,
  ) {
    const where: any = {};

    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (teacher) {
      where.teacher = { contains: teacher, mode: 'insensitive' };
    }

    return this.courseService.findAll({
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
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  async update(@Param('id') id: string, @Body() updateCourseData: any) {
    return this.courseService.update(id, updateCourseData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.courseService.remove(id);
  }
}

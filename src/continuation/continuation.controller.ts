import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContinuationService } from './continuation.service';
import { Continuation } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateContinuationDto } from './dto/create-continuation.dto';
import { UpdateContinuationDto } from './dto/update-continuation.dto';
import { IdParamDto } from './dto/id-param.dto';

@ApiTags('continuations')
@ApiBearerAuth()
@Controller('continuations')
@UseGuards(JwtAuthGuard)
export class ContinuationController {
  constructor(private readonly continuationService: ContinuationService) {}

  @Get()
  async findAll(): Promise<Continuation[]> {
    return this.continuationService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<Continuation | null> {
    return this.continuationService.findOne(params.id);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string): Promise<Continuation | null> {
    return this.continuationService.findByStudent(studentId);
  }

  @Post()
  async create(@Body() createContinuationDto: CreateContinuationDto): Promise<Continuation> {
    const { studentId, ...rest } = createContinuationDto;
    return this.continuationService.create({
      ...rest,
      student: {
        connect: { id: studentId }
      }
    });
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() updateContinuationDto: UpdateContinuationDto,
  ): Promise<Continuation> {
    const { studentId, ...rest } = updateContinuationDto;
    const data: any = { ...rest };
    
    if (studentId) {
      data.student = {
        connect: { id: studentId }
      };
    }
    
    return this.continuationService.update(params.id, data);
  }

  @Delete(':id')
  async delete(@Param() params: IdParamDto): Promise<Continuation> {
    return this.continuationService.delete(params.id);
  }
} 
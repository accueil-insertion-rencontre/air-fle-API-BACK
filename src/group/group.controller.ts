import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  create(@Body() createGroupData: Prisma.GroupCreateInput) {
    return this.groupService.create(createGroupData);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('label') label?: string,
  ) {
    const where: Prisma.GroupWhereInput = {};
    
    if (label) {
      where.label = { contains: label, mode: 'insensitive' };
    }
    
    return this.groupService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  update(
    @Param('id') id: string,
    @Body() updateGroupData: Prisma.GroupUpdateInput,
  ) {
    return this.groupService.update(id, updateGroupData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':id/students/:studentId')
  @Roles('ADMIN', 'TEACHER')
  addStudent(
    @Param('id') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.groupService.addStudent(groupId, studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles('ADMIN', 'TEACHER')
  removeStudent(
    @Param('id') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.groupService.removeStudent(groupId, studentId);
  }
}

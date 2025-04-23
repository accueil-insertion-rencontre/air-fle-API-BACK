import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SelfProfileGuard } from './guards/self-profile.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createUserData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role_id: string;
  }) {
    return this.userService.create(createUserData);
  }

  @Get()
  @Roles('ADMIN')
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('email') email?: string,
    @Query('role') roleId?: string,
  ) {
    const where: Prisma.UserWhereInput = {};
    
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    
    if (roleId) {
      where.role_id = roleId;
    }
    
    return this.userService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
    });
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateUserData: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, updateUserData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard, SelfProfileGuard)
  async getProfile(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}

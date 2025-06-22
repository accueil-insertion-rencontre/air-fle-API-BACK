import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from './course.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('CourseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CourseModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le CourseService', () => {
    const courseService = module.get<CourseService>(CourseService);
    expect(courseService).toBeDefined();
  });

  it('devrait contenir le CourseController', () => {
    const courseController = module.get<CourseController>(CourseController);
    expect(courseController).toBeDefined();
  });

  it('devrait importer le PrismaModule', () => {
    // Vérification indirecte: si le PrismaModule n'était pas importé,
    // le CourseService ne pourrait pas être instancié car il dépend de PrismaService
    const courseService = module.get<CourseService>(CourseService);
    expect(courseService).toBeDefined();
  });
});

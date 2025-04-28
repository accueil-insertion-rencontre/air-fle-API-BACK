import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { Escape } from 'class-sanitizer';

export class CreateAbsenceDto {
  @ApiProperty({
    description: 'Identifiant de l\'étudiant',
    example: 'def456',
    required: true
  })
  @IsUUID(4)
  student_id: string;

  @ApiProperty({
    description: 'Identifiant du cours',
    example: 'ghi789',
    required: true
  })
  @IsUUID(4)
  course_id: string;

  @ApiProperty({
    description: 'Raison de l\'absence',
    example: 'Maladie',
    required: false
  })
  @IsString()
  @IsOptional()
  @Escape()
  reason?: string;
} 
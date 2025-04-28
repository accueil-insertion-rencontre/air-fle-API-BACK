import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Escape } from 'class-sanitizer';

export class CreateExamDto {
  @ApiProperty({
    description: 'Libellé de l\'examen',
    example: 'Examen final A1'
  })
  @IsString()
  @Escape()
  label: string;

  @ApiProperty({
    description: 'Date de passation de l\'examen',
    example: '2023-09-15T10:00:00.000Z'
  })
  @IsDate()
  @Type(() => Date)
  taked_at: Date;

  @ApiProperty({
    description: 'Note ou résultat de l\'examen',
    example: 'B1 - 14/20',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Escape()
  note?: string | null;

  @ApiProperty({
    description: 'ID de l\'étudiant associé à l\'examen',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  student_id: string;
} 
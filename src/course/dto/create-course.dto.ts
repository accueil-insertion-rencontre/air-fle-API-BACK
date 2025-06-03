import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { Escape } from 'class-sanitizer';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Jour du cours',
    example: '2023-09-01T00:00:00.000Z',
    required: false,
    nullable: true
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  day?: Date | null;

  @ApiProperty({
    description: 'Heure de début du cours',
    example: '2023-09-01T09:00:00.000Z',
    required: false,
    nullable: true
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start_hour?: Date | null;

  @ApiProperty({
    description: 'Heure de fin du cours',
    example: '2023-09-01T11:00:00.000Z',
    required: false,
    nullable: true
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end_hour?: Date | null;

  @ApiProperty({
    description: 'Intitulé du cours',
    example: 'Français débutant - Module A1',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Escape()
  intitule?: string | null;

  @ApiProperty({
    description: 'ID du groupe associé au cours',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  group_id: string;

  @ApiProperty({
    description: 'ID du professeur assigné au cours (optionnel)',
    example: '456e7890-e89b-12d3-a456-426614174001',
    required: false,
    nullable: true
  })
  @IsUUID()
  @IsOptional()
  user_id?: string | null;

  @ApiProperty({
    description: 'Couleur personnalisée du cours (hex, ex: #007bff)',
    example: '#007bff',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'La couleur doit être au format hexadécimal (#RRGGBB)'
  })
  color?: string | null;
} 
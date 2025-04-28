import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { Escape } from 'class-sanitizer';

export class CreatePeriodDto {
  @ApiProperty({
    description: 'Libellé de la période',
    example: 'Printemps 2023'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Escape()
  label: string;

  @ApiProperty({
    description: 'Date de début de la période',
    example: '2023-03-01T00:00:00.000Z'
  })
  @IsDateString()
  @IsNotEmpty()
  startedAt: string | Date;

  @ApiProperty({
    description: 'Date de fin de la période',
    example: '2023-06-30T00:00:00.000Z'
  })
  @IsDateString()
  @IsNotEmpty()
  endedAt: string | Date;

  @ApiProperty({
    description: 'Indique si c\'est la période actuelle',
    example: false,
    default: false
  })
  @IsBoolean()
  actual_period: boolean = false;
} 
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Jean',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Dupont',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'jean.dupont@exemple.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur (minimum 6 caractères)',
    example: 'motdepasse123',
    required: true,
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Identifiant du rôle de l\'utilisateur',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  role_id: string;
} 
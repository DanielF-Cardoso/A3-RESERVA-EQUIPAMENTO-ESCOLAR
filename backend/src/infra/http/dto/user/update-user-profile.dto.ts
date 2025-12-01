import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class UpdateUserProfileDTO {
  @ApiPropertyOptional({
    description: 'O nome completo do usuário.',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  @MinLength(3, {
    message: 'Validation error',
  })
  fullName?: string

  @ApiPropertyOptional({
    description: 'O endereço de e-mail do usuário (@escola.com).',
    example: 'joao.silva@escola.com',
  })
  @IsOptional()
  @IsEmail(undefined, {
    message: 'Validation error',
  })
  email?: string

  @ApiPropertyOptional({
    description:
      'O número de telefone do usuário (apenas números, com DDD). Use string vazia para remover.',
    example: '11999999999',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  @Matches(/^([1-9][0-9][2-9][0-9]{8})?$/, {
    message: 'Validation error',
  })
  phone?: string

  @ApiPropertyOptional({
    description: 'O cargo do usuário no sistema (apenas ADMIN pode alterar).',
    example: 'STAFF',
    enum: ['TEACHER', 'STAFF', 'ADMIN'],
  })
  @IsOptional()
  @IsEnum(['TEACHER', 'STAFF', 'ADMIN'], {
    message: 'Validation error',
  })
  role?: string
}

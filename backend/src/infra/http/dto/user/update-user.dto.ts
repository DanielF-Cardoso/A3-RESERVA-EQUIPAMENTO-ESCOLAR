import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class UpdateUserDTO {
  @ApiPropertyOptional({
    description: 'O nome completo do usuário.',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString({ message: 'O nome completo deve ser uma string válida.' })
  @MinLength(3, {
    message: 'O nome completo deve ter no mínimo 3 caracteres.',
  })
  fullName?: string

  @ApiPropertyOptional({
    description: 'O endereço de e-mail do usuário (@escola.com).',
    example: 'joao.silva@escola.com',
  })
  @IsOptional()
  @IsEmail(undefined, {
    message: 'O e-mail deve ser válido.',
  })
  email?: string

  @ApiPropertyOptional({
    description:
      'O número de telefone do usuário (apenas números, com DDD). Use string vazia para remover.',
    example: '11999999999',
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string válida.' })
  @Matches(/^([1-9][0-9][2-9][0-9]{8})?$/, {
    message: 'O telefone deve conter 11 dígitos numéricos com DDD válido.',
  })
  phone?: string

  @ApiPropertyOptional({
    description: 'O cargo do usuário no sistema.',
    example: 'STAFF',
    enum: ['TEACHER', 'STAFF', 'ADMIN'],
  })
  @IsOptional()
  @IsEnum(['TEACHER', 'STAFF', 'ADMIN'], {
    message: 'O cargo deve ser TEACHER, STAFF ou ADMIN.',
  })
  role?: string
}

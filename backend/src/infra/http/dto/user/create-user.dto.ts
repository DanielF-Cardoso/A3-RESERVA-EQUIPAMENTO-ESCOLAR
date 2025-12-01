import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class CreateUserDTO {
  @ApiProperty({
    description: 'O nome completo do usuário.',
    example: 'João Silva Santos',
  })
  @IsString({ message: 'Validation error' })
  @IsNotEmpty({ message: 'Validation error' })
  @MinLength(3, {
    message: 'Validation error',
  })
  fullName!: string

  @ApiProperty({
    description: 'O endereço de e-mail do usuário (@escola.com).',
    example: 'joao.silva@escola.com',
  })
  @IsString({ message: 'Validation error' })
  @IsEmail(undefined, {
    message: 'Validation error',
  })
  @IsNotEmpty({ message: 'Validation error' })
  email!: string

  @ApiProperty({
    description: 'A senha do usuário. Deve ter pelo menos 6 caracteres.',
    example: 'senhaSegura123',
  })
  @IsString({ message: 'Validation error' })
  @IsNotEmpty({ message: 'Validation error' })
  @MinLength(6, {
    message: 'Validation error',
  })
  password!: string

  @ApiPropertyOptional({
    description: 'O número de telefone do usuário (apenas números, com DDD).',
    example: '11999999999',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  @Matches(/^[1-9][0-9][2-9][0-9]{8}$/, {
    message: 'Validation error',
  })
  phone?: string

  @ApiPropertyOptional({
    description: 'O cargo do usuário no sistema.',
    example: 'TEACHER',
    enum: ['TEACHER', 'STAFF', 'ADMIN'],
    default: 'TEACHER',
  })
  @IsOptional()
  @IsEnum(['TEACHER', 'STAFF', 'ADMIN'], {
    message: 'Validation error',
  })
  role?: string
}

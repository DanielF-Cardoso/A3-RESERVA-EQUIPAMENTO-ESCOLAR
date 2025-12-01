import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'O token de recuperação de senha recebido por e-mail.',
    example: 'abc123def456ghi789jkl',
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsString({ message: 'Validation error' })
  token!: string

  @ApiProperty({
    description: 'A nova senha do usuário (mínimo 6 caracteres).',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsString({ message: 'Validation error' })
  @MinLength(6, {
    message: 'Validation error',
  })
  password!: string
}

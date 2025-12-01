import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePasswordDTO {
  @ApiProperty({
    description: 'A senha atual do usuário.',
    example: 'senhaAtual123',
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsString({ message: 'Validation error' })
  currentPassword!: string

  @ApiProperty({
    description: 'A nova senha do usuário (mínimo 6 caracteres).',
    example: 'novaSenha456',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsString({ message: 'Validation error' })
  @MinLength(6, {
    message: 'Validation error',
  })
  newPassword!: string
}

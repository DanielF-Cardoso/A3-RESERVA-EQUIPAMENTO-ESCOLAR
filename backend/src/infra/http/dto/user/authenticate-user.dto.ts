import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateUserDTO {
  @ApiProperty({
    description: 'O endereço de e-mail do usuário (@escola.com).',
    example: 'professor@escola.com',
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsEmail(undefined, {
    message: 'Validation error',
  })
  email!: string

  @ApiProperty({
    description: 'A senha do usuário.',
    example: 'senhaSegura123',
  })
  @IsString({ message: 'Validation error' })
  @IsNotEmpty({ message: 'Validation error' })
  password!: string
}

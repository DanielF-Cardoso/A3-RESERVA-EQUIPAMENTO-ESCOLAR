import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'O endereço de e-mail do usuário para recuperação de senha.',
    example: 'joao.silva@escola.com',
  })
  @IsNotEmpty({ message: 'Validation error' })
  @IsEmail(undefined, {
    message: 'Validation error',
  })
  email!: string
}

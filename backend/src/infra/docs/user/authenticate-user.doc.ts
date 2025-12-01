import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { AuthenticateUserDTO } from '@/infra/http/dto/user/authenticate-user.dto'

export function AuthenticateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autenticar usuário',
      description:
        'Autentica um usuário do sistema com e-mail e senha. Retorna o token de acesso JWT e o cargo (role) do usuário.',
    }),
    ApiBody({
      description: 'Credenciais do usuário.',
      type: AuthenticateUserDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Autenticado com sucesso.',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          role: 'TEACHER',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Credenciais inválidas.',
    }),
    ApiResponse({
      status: 401,
      description: 'Conta inativa.',
    }),
  )
}

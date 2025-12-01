import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ForgotPasswordDTO } from '@/infra/http/dto/user/forgot-password.dto'

export function ForgotPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Solicitar recuperação de senha',
      description:
        'Inicia o fluxo de recuperação de senha: envia um e-mail com um token de uso único para redefinição. O endpoint não divulga se o e-mail existe no sistema por questões de segurança.',
    }),
    ApiBody({
      description: 'E-mail para envio do token de recuperação',
      type: ForgotPasswordDTO,
    }),
    ApiResponse({
      status: 200,
      description:
        'Solicitação recebida. Se o e-mail existir, um token de recuperação será enviado. Não retorna dados.',
    }),
    ApiResponse({
      status: 429,
      description:
        'Muitas requisições. O servidor pode limitar a frequência de pedidos de token (ex.: 1 por hora).',
    }),
  )
}

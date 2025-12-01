import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ResetPasswordDTO } from '@/infra/http/dto/user/reset-password.dto'

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Redefinir senha usando token',
      description:
        'Redefine a senha do usuário usando o token de recuperação recebido por e-mail. O token é passado como parâmetro na URL e a nova senha no corpo.',
    }),
    ApiParam({
      name: 'token',
      description: 'Token de recuperação enviado por e-mail',
      required: true,
      type: String,
    }),
    ApiBody({
      description: 'Nova senha para o usuário',
      type: ResetPasswordDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Senha redefinida com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Token inválido ou expirado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro genérico do servidor.',
    }),
  )
}

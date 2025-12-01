import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

export function InactivateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Inativar usuário',
      description:
        'Inativa (soft delete) o usuário especificado pelo ID. Apenas administradores ou usuários com permissão podem executar. A operação não remove dados do banco, apenas marca o usuário como inativo.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do usuário a ser inativado',
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário inativado com sucesso.',
      schema: {
        example: {
          message: 'Usuário inativado com sucesso.',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Operação proibida. Ex.: tentativa de inativar a própria conta ou inativar o último usuário ativo.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado.',
    }),
  )
}

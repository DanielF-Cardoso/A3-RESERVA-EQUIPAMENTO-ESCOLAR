import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger'
import { UpdateUserProfileDTO } from '@/infra/http/dto/user/update-user-profile.dto'

export function UpdateOtherUserProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar perfil de outro usuário',
      description:
        'Permite que um administrador atualize os dados cadastrais de outro usuário pelo ID. Útil para alteração de cargo (role) e informações administrativas.',
    }),
    ApiParam({
      name: 'userId',
      description: 'ID do usuário a ser atualizado',
      required: true,
      type: String,
    }),
    ApiBody({
      description: 'Dados para atualização do perfil do usuário',
      type: UpdateUserProfileDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil do usuário atualizado com sucesso.',
      schema: {
        example: {
          user: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            fullName: 'Pedro Alves',
            email: 'pedro.alves@escola.com',
            phone: '11977776666',
            role: 'STAFF',
            isActive: true,
            lastLogin: null,
            createdAt: '2024-12-01T10:00:00Z',
            updatedAt: '2025-03-10T09:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflito: email ou telefone já cadastrados.',
    }),
  )
}

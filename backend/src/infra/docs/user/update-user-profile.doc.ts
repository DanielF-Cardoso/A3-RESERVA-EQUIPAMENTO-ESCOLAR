import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { UpdateUserProfileDTO } from '@/infra/http/dto/user/update-user-profile.dto'

export function UpdateUserProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar o próprio perfil',
      description:
        'Permite que o usuário autenticado atualize seus próprios dados (fullName, email, phone). Para remover o telefone, envie string vazia ("").',
    }),
    ApiBody({
      description: 'Dados para atualização do perfil do usuário autenticado',
      type: UpdateUserProfileDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil atualizado com sucesso.',
      schema: {
        example: {
          user: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            fullName: 'Ana Maria Pereira',
            email: 'ana.pereira@escola.com',
            phone: null,
            role: 'STAFF',
            isActive: true,
            lastLogin: '2025-09-02T10:22:00Z',
            createdAt: '2024-11-10T09:30:00Z',
            updatedAt: '2025-10-02T08:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Requisição inválida (validação falhou).',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflito: email ou telefone já cadastrados por outro usuário.',
    }),
  )
}

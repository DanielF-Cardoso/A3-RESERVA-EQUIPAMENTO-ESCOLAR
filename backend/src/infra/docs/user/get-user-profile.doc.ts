import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function GetUserProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter perfil do usuário autenticado',
      description:
        'Retorna os dados do usuário atualmente autenticado. Requer o token JWT no cabeçalho.',
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil do usuário retornado com sucesso.',
      schema: {
        example: {
          user: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            fullName: 'Ana Maria Pereira',
            email: 'ana.pereira@escola.com',
            phone: '11988887777',
            role: 'STAFF',
            isActive: true,
            lastLogin: '2025-09-02T10:22:00Z',
            createdAt: '2024-11-10T09:30:00Z',
            updatedAt: '2025-01-10T14:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado. Token inválido ou ausente.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado.',
    }),
  )
}

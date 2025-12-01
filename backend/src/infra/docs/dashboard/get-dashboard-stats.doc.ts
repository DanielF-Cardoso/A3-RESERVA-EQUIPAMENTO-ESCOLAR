import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function GetDashboardStatsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter estatísticas do dashboard',
      description:
        'Retorna estatísticas gerais do sistema incluindo total de equipamentos, agendamentos ativos, usuários e equipamentos em manutenção, além dos agendamentos recentes. Requer autenticação (qualquer usuário autenticado).',
    }),
    ApiResponse({
      status: 200,
      description: 'Estatísticas do dashboard retornadas com sucesso.',
      schema: {
        example: {
          stats: {
            totalEquipments: 34,
            activeSchedulings: 8,
            totalUsers: 5,
            equipmentsInMaintenance: 2,
          },
          recentSchedulings: [
            {
              id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
              equipmentName: 'Notebook Dell Inspiron',
              userName: 'Prof. João Oliveira',
              userEmail: 'professor@escola.com',
              startDate: '2025-12-03T08:00:00.000Z',
              endDate: '2025-12-03T12:00:00.000Z',
              quantity: 4,
              status: 'SCHEDULED',
              notes: 'Workshop de Design Gráfico',
              createdAt: '2025-12-01T10:00:00.000Z',
            },
            {
              id: 'b2c3d4e5-f6g7-8901-bcde-2345678901fg',
              equipmentName: 'Tablet Samsung Galaxy Tab',
              userName: 'Profa. Ana Paula Costa',
              userEmail: 'ana.costa@escola.com',
              startDate: '2025-12-04T13:00:00.000Z',
              endDate: '2025-12-04T16:00:00.000Z',
              quantity: 6,
              status: 'CONFIRMED',
              notes: 'Atividade interativa de matemática',
              createdAt: '2025-12-01T11:30:00.000Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado. Token inválido ou ausente.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor.',
    }),
  )
}

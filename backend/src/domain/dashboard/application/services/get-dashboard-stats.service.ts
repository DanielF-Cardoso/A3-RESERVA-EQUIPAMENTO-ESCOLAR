import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { SchedulingRepository } from '@/domain/scheduling/application/repositories/scheduling-repository'
import { UserRepository } from '@/domain/user/application/repositories/user-repository'
import { Either, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'

interface DashboardStats {
  totalEquipment: number
  availableEquipment: number
  equipmentInUse: number
  equipmentInMaintenance: number
  totalSchedulings: number
  activeSchedulings: number
  completedSchedulings: number
  cancelledSchedulings: number
  totalUsers: number
  activeUsers: number
  usageRate: number
}

type GetDashboardStatsResponse = Either<
  never,
  {
    stats: DashboardStats
    recentSchedulings: Scheduling[]
  }
>

@Injectable()
export class GetDashboardStatsService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private schedulingRepository: SchedulingRepository,
    private userRepository: UserRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<GetDashboardStatsResponse> {
    this.logger.log('Getting dashboard statistics', 'GetDashboardStatsService')

    // Buscar todos os dados em paralelo
    const [allEquipments, allSchedulings, allUsers] = await Promise.all([
      this.equipmentRepository.findAll(),
      this.schedulingRepository.findAll(),
      this.userRepository.findAll(),
    ])

    // Filtrar equipamentos ativos
    const activeEquipments = allEquipments.filter((e) => e.isActive)

    // Estatísticas de equipamentos
    const totalEquipment = activeEquipments.length
    const availableEquipment = activeEquipments.filter(
      (e) => e.status.toValue() === 'AVAILABLE',
    ).length
    const equipmentInUse = activeEquipments.filter(
      (e) => e.status.toValue() === 'IN_USE',
    ).length
    const equipmentInMaintenance = activeEquipments.filter(
      (e) => e.status.toValue() === 'MAINTENANCE',
    ).length

    // Estatísticas de agendamentos
    const totalSchedulings = allSchedulings.length
    const activeSchedulings = allSchedulings.filter((s) => s.isActive).length
    const completedSchedulings = allSchedulings.filter(
      (s) => s.isCompleted,
    ).length
    const cancelledSchedulings = allSchedulings.filter(
      (s) => s.isCancelled,
    ).length

    // Estatísticas de usuários
    const totalUsers = allUsers.length
    const activeUsers = allUsers.filter((u) => u.isActive).length

    // Taxa de uso (equipamentos em uso / total de equipamentos)
    const usageRate =
      totalEquipment > 0
        ? Math.round((equipmentInUse / totalEquipment) * 100)
        : 0

    // Agendamentos recentes (últimos 5, ordenados por data de criação)
    const recentSchedulings = allSchedulings
      .sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice(0, 5)

    const stats: DashboardStats = {
      totalEquipment,
      availableEquipment,
      equipmentInUse,
      equipmentInMaintenance,
      totalSchedulings,
      activeSchedulings,
      completedSchedulings,
      cancelledSchedulings,
      totalUsers,
      activeUsers,
      usageRate,
    }

    this.logger.log(
      'Dashboard statistics retrieved successfully',
      'GetDashboardStatsService',
    )

    return right({ stats, recentSchedulings })
  }
}

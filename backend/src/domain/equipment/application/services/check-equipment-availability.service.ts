import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Either, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { SchedulingRepository } from '@/domain/scheduling/application/repositories/scheduling-repository'

interface CheckEquipmentAvailabilityRequest {
  startDate: Date
  endDate: Date
}

interface EquipmentAvailability {
  equipmentId: string
  name: string
  type: string
  totalQuantity: number
  availableQuantity: number
  isAvailable: boolean
}

type CheckEquipmentAvailabilityResponse = Either<
  never,
  { equipments: EquipmentAvailability[] }
>

@Injectable()
export class CheckEquipmentAvailabilityService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private schedulingRepository: SchedulingRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    startDate,
    endDate,
  }: CheckEquipmentAvailabilityRequest): Promise<CheckEquipmentAvailabilityResponse> {
    this.logger.log(
      `Checking equipment availability from ${startDate} to ${endDate}`,
      'CheckEquipmentAvailabilityService',
    )

    // Buscar todos os equipamentos ativos
    const allEquipments = await this.equipmentRepository.findAll()
    const activeEquipments = allEquipments.filter((e) => e.isActive)

    // Para cada equipamento, calcular disponibilidade
    const availabilityPromises = activeEquipments.map(async (equipment) => {
      // Buscar agendamentos conflitantes
      const conflictingSchedulings =
        await this.schedulingRepository.findActiveByEquipmentIdAndDateRange(
          equipment.id.toString(),
          startDate,
          endDate,
        )

      // Calcular quantidade total agendada
      const totalScheduledQuantity = conflictingSchedulings.reduce(
        (sum, scheduling) => sum + scheduling.quantity,
        0,
      )

      // Calcular quantidade disponível
      const availableQuantity = equipment.quantity - totalScheduledQuantity

      return {
        equipmentId: equipment.id.toString(),
        name: equipment.name,
        type: equipment.type.toValue(),
        totalQuantity: equipment.quantity,
        availableQuantity: Math.max(0, availableQuantity),
        isAvailable: availableQuantity > 0,
      }
    })

    const equipments = await Promise.all(availabilityPromises)

    this.logger.log(
      `Found ${equipments.length} equipments, ${equipments.filter((e) => e.isAvailable).length} available`,
      'CheckEquipmentAvailabilityService',
    )

    return right({ equipments })
  }
}

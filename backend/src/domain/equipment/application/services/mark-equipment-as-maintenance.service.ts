import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, left, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

type MarkEquipmentAsMaintenanceRequest = {
  equipmentId: string
}

type MarkEquipmentAsMaintenanceResponse = Either<
  ResourceNotFoundError,
  { equipment: Equipment }
>

@Injectable()
export class MarkEquipmentAsMaintenanceService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: MarkEquipmentAsMaintenanceRequest,
  ): Promise<MarkEquipmentAsMaintenanceResponse> {
    const { equipmentId } = request

    this.logger.log(
      `Marking equipment ${equipmentId} as maintenance`,
      'MarkEquipmentAsMaintenanceService',
    )

    const equipment = await this.equipmentRepository.findById(equipmentId)

    if (!equipment) {
      this.logger.warn(
        `Equipment ${equipmentId} not found`,
        'MarkEquipmentAsMaintenanceService',
      )
      return left(new ResourceNotFoundError('equipment'))
    }

    equipment.markAsMaintenance()

    await this.equipmentRepository.save(equipment)

    this.logger.log(
      `Equipment ${equipmentId} marked as maintenance successfully`,
      'MarkEquipmentAsMaintenanceService',
    )

    return right({ equipment })
  }
}

import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, left, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

type MarkEquipmentAsAvailableRequest = {
  equipmentId: string
}

type MarkEquipmentAsAvailableResponse = Either<
  ResourceNotFoundError,
  { equipment: Equipment }
>

@Injectable()
export class MarkEquipmentAsAvailableService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: MarkEquipmentAsAvailableRequest,
  ): Promise<MarkEquipmentAsAvailableResponse> {
    const { equipmentId } = request

    this.logger.log(
      `Marking equipment ${equipmentId} as available`,
      'MarkEquipmentAsAvailableService',
    )

    const equipment = await this.equipmentRepository.findById(equipmentId)

    if (!equipment) {
      this.logger.warn(
        `Equipment ${equipmentId} not found`,
        'MarkEquipmentAsAvailableService',
      )
      return left(new ResourceNotFoundError('Equipamento não encontrado.'))
    }

    equipment.markAsAvailable()

    await this.equipmentRepository.save(equipment)

    this.logger.log(
      `Equipment ${equipmentId} marked as available successfully`,
      'MarkEquipmentAsAvailableService',
    )

    return right({ equipment })
  }
}

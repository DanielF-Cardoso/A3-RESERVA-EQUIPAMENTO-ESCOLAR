import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, left, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

type InactivateEquipmentRequest = {
  equipmentId: string
}

type InactivateEquipmentResponse = Either<
  ResourceNotFoundError,
  { equipment: Equipment }
>

@Injectable()
export class InactivateEquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: InactivateEquipmentRequest,
  ): Promise<InactivateEquipmentResponse> {
    const { equipmentId } = request

    this.logger.log(
      `Inactivating equipment ${equipmentId}`,
      'InactivateEquipmentService',
    )

    const equipment = await this.equipmentRepository.findById(equipmentId)

    if (!equipment) {
      this.logger.warn(
        `Equipment ${equipmentId} not found`,
        'InactivateEquipmentService',
      )
      return left(new ResourceNotFoundError('equipment'))
    }

    equipment.inactivate()

    await this.equipmentRepository.save(equipment)

    this.logger.log(
      `Equipment ${equipmentId} inactivated successfully`,
      'InactivateEquipmentService',
    )

    return right({ equipment })
  }
}

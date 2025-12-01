import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { Scheduling } from '../../enterprise/entities/scheduling.entity'
import { Either, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

interface ListSchedulingsRequest {
  date?: Date
  userId?: string
  equipmentId?: string
}

type ListSchedulingsResponse = Either<null, { schedulings: Scheduling[] }>

@Injectable()
export class ListSchedulingsService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: ListSchedulingsRequest = {},
  ): Promise<ListSchedulingsResponse> {
    const { date, userId, equipmentId } = request

    this.logger.log('Listing schedulings', 'ListSchedulingsService')

    let schedulings: Scheduling[]

    if (date) {
      schedulings = await this.schedulingRepository.findByDate(date)
      this.logger.log(
        `Found ${schedulings.length} schedulings for date ${date.toISOString()}`,
        'ListSchedulingsService',
      )
    } else if (userId) {
      schedulings = await this.schedulingRepository.findByUserId(userId)
      this.logger.log(
        `Found ${schedulings.length} schedulings for user ${userId}`,
        'ListSchedulingsService',
      )
    } else if (equipmentId) {
      schedulings =
        await this.schedulingRepository.findByEquipmentId(equipmentId)
      this.logger.log(
        `Found ${schedulings.length} schedulings for equipment ${equipmentId}`,
        'ListSchedulingsService',
      )
    } else {
      schedulings = await this.schedulingRepository.findAll()
      this.logger.log(
        `Found ${schedulings.length} schedulings`,
        'ListSchedulingsService',
      )
    }

    return right({ schedulings })
  }
}

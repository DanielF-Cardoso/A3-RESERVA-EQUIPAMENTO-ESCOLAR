import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { Scheduling } from '../../enterprise/entities/scheduling.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DomainEvents } from '@/core/events/domain-events'
import { SchedulingConfirmedEvent } from '../../enterprise/events/scheduling-confirmed.event'

interface ConfirmSchedulingRequest {
  schedulingId: string
  userRole: 'TEACHER' | 'STAFF' | 'ADMIN'
}

type ConfirmSchedulingResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { scheduling: Scheduling }
>

@Injectable()
export class ConfirmSchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    schedulingId,
    userRole,
  }: ConfirmSchedulingRequest): Promise<ConfirmSchedulingResponse> {
    this.logger.log(
      `Confirming scheduling ${schedulingId} by role ${userRole}`,
      'ConfirmSchedulingService',
    )

    // Check if user has permission (only STAFF and ADMIN can confirm)
    if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
      this.logger.warn(
        `User with role ${userRole} attempted to confirm scheduling`,
        'ConfirmSchedulingService',
      )
      return left(
        new NotAllowedError(
          'You are not authorized to perform this action.',
        ),
      )
    }

    const scheduling = await this.schedulingRepository.findById(schedulingId)

    if (!scheduling) {
      this.logger.warn(
        `Scheduling ${schedulingId} not found`,
        'ConfirmSchedulingService',
      )
      return left(
        new ResourceNotFoundError(
          'Scheduling not found.',
        ),
      )
    }

    try {
      scheduling.confirm()
      await this.schedulingRepository.save(scheduling)

      // Dispatch domain event
      DomainEvents.markEventForDispatch(new SchedulingConfirmedEvent(scheduling))
      DomainEvents.dispatchEvents()

      this.logger.log(
        `Scheduling ${schedulingId} confirmed successfully`,
        'ConfirmSchedulingService',
      )

      return right({ scheduling })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(
        `Error confirming scheduling: ${errorMessage}`,
        'ConfirmSchedulingService',
      )
      return left(
        new NotAllowedError(
          errorMessage || 'You are not authorized to perform this action.',
        ),
      )
    }
  }
}

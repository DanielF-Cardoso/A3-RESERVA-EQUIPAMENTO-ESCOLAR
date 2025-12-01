import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { Scheduling } from '../../enterprise/entities/scheduling.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DomainEvents } from '@/core/events/domain-events'
import { SchedulingCancelledEvent } from '../../enterprise/events/scheduling-cancelled.event'

interface CancelSchedulingRequest {
  schedulingId: string
  userRole: 'TEACHER' | 'STAFF' | 'ADMIN'
}

type CancelSchedulingResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { scheduling: Scheduling }
>

@Injectable()
export class CancelSchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    schedulingId,
    userRole,
  }: CancelSchedulingRequest): Promise<CancelSchedulingResponse> {
    this.logger.log(
      `Cancelling scheduling ${schedulingId} by role ${userRole}`,
      'CancelSchedulingService',
    )

    // Check if user has permission (only STAFF and ADMIN can cancel)
    if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
      this.logger.warn(
        `User with role ${userRole} attempted to cancel scheduling`,
        'CancelSchedulingService',
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
        'CancelSchedulingService',
      )
      return left(
        new ResourceNotFoundError(
          'Scheduling not found.',
        ),
      )
    }

    try {
      scheduling.cancel()
      await this.schedulingRepository.save(scheduling)

      // Dispatch domain event
      DomainEvents.markEventForDispatch(
        new SchedulingCancelledEvent(scheduling),
      )
      DomainEvents.dispatchEvents()

      this.logger.log(
        `Scheduling ${schedulingId} cancelled successfully`,
        'CancelSchedulingService',
      )

      return right({ scheduling })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(
        `Error cancelling scheduling: ${errorMessage}`,
        'CancelSchedulingService',
      )
      return left(
        new NotAllowedError(
          errorMessage || 'You are not authorized to perform this action.',
        ),
      )
    }
  }
}

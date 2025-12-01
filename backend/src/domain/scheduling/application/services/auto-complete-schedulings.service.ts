import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DomainEvents } from '@/core/events/domain-events'
import { SchedulingCompletedEvent } from '../../enterprise/events/scheduling-completed.event'

@Injectable()
export class AutoCompleteSchedulingsService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async execute(): Promise<void> {
    this.logger.log(
      'Running auto-complete schedulings job',
      'AutoCompleteSchedulingsService',
    )

    try {
      const now = new Date()
      const allSchedulings = await this.schedulingRepository.findAll()

      const schedulingsToComplete = allSchedulings.filter((scheduling) => {
        return (
          scheduling.status === 'CONFIRMED' && scheduling.endDate <= now
        )
      })

      if (schedulingsToComplete.length === 0) {
        this.logger.log(
          'No schedulings to auto-complete',
          'AutoCompleteSchedulingsService',
        )
        return
      }

      this.logger.log(
        `Found ${schedulingsToComplete.length} schedulings to auto-complete`,
        'AutoCompleteSchedulingsService',
      )

      for (const scheduling of schedulingsToComplete) {
        try {
          scheduling.complete()
          await this.schedulingRepository.save(scheduling)

          DomainEvents.markEventForDispatch(
            new SchedulingCompletedEvent(scheduling),
          )

          this.logger.log(
            `Scheduling ${scheduling.id.toString()} auto-completed`,
            'AutoCompleteSchedulingsService',
          )
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          this.logger.error(
            `Error auto-completing scheduling ${scheduling.id.toString()}: ${errorMessage}`,
            'AutoCompleteSchedulingsService',
          )
        }
      }

      DomainEvents.dispatchEvents()

      this.logger.log(
        `Auto-completed ${schedulingsToComplete.length} schedulings`,
        'AutoCompleteSchedulingsService',
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(
        `Error in auto-complete job: ${errorMessage}`,
        'AutoCompleteSchedulingsService',
      )
    }
  }
}

import { DomainEvent } from '@/core/events/domain-event'
import { Scheduling } from '../entities/scheduling.entity'

export class SchedulingCancelledEvent implements DomainEvent {
  public readonly occurredAt: Date
  public readonly scheduling: Scheduling

  constructor(scheduling: Scheduling) {
    this.occurredAt = new Date()
    this.scheduling = scheduling
  }

  getAggregateId(): string {
    return this.scheduling.id.toString()
  }
}

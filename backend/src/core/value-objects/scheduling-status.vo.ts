import { SchedulingStatus as PrismaSchedulingStatus } from '@prisma/client'

export class SchedulingStatus {
  private readonly value: PrismaSchedulingStatus

  constructor(status: PrismaSchedulingStatus | string) {
    const validStatuses: PrismaSchedulingStatus[] = [
      'SCHEDULED',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
    ]

    const statusValue =
      typeof status === 'string'
        ? (status.toUpperCase() as PrismaSchedulingStatus)
        : status

    if (!validStatuses.includes(statusValue)) {
      throw new Error(
        `Invalid scheduling status. Must be one of: ${validStatuses.join(', ')}`,
      )
    }

    this.value = statusValue
  }

  toValue(): PrismaSchedulingStatus {
    return this.value
  }

  equals(other: SchedulingStatus): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }

  // Métodos auxiliares
  isScheduled(): boolean {
    return this.value === 'SCHEDULED'
  }

  isConfirmed(): boolean {
    return this.value === 'CONFIRMED'
  }

  isCompleted(): boolean {
    return this.value === 'COMPLETED'
  }

  isCancelled(): boolean {
    return this.value === 'CANCELLED'
  }

  canBeEdited(): boolean {
    return this.value === 'SCHEDULED' || this.value === 'CONFIRMED'
  }

  canBeCancelled(): boolean {
    return this.value === 'SCHEDULED' || this.value === 'CONFIRMED'
  }

  canBeConfirmed(): boolean {
    return this.value === 'SCHEDULED'
  }

  canBeCompleted(): boolean {
    return this.value === 'CONFIRMED'
  }
}

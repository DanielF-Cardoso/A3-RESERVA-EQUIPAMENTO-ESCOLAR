import { EquipmentStatus as PrismaEquipmentStatus } from '@prisma/client'

export class EquipmentStatus {
  private readonly value: PrismaEquipmentStatus

  constructor(status: PrismaEquipmentStatus | string) {
    const validStatuses: PrismaEquipmentStatus[] = [
      'AVAILABLE',
      'IN_USE',
      'MAINTENANCE',
    ]

    const statusValue =
      typeof status === 'string'
        ? (status.toUpperCase() as PrismaEquipmentStatus)
        : status

    if (!validStatuses.includes(statusValue)) {
      throw new Error(
        `Invalid equipment status. Must be one of: ${validStatuses.join(', ')}`,
      )
    }

    this.value = statusValue
  }

  toValue(): PrismaEquipmentStatus {
    return this.value
  }

  equals(other: EquipmentStatus): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }

  // Métodos auxiliares
  isAvailable(): boolean {
    return this.value === 'AVAILABLE'
  }

  isInUse(): boolean {
    return this.value === 'IN_USE'
  }

  isInMaintenance(): boolean {
    return this.value === 'MAINTENANCE'
  }

  canBeScheduled(): boolean {
    return this.value === 'AVAILABLE'
  }
}

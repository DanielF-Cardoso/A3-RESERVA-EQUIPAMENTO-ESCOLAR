import { SchedulingRepository } from '@/domain/scheduling/application/repositories/scheduling-repository'
import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'

export class InMemorySchedulingRepository implements SchedulingRepository {
  public items: Scheduling[] = []

  async create(scheduling: Scheduling): Promise<Scheduling> {
    this.items.push(scheduling)
    return scheduling
  }

  async save(scheduling: Scheduling): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(scheduling.id),
    )

    if (index >= 0) {
      this.items[index] = scheduling
    }
  }

  async findById(id: string): Promise<Scheduling | null> {
    const scheduling = this.items.find((item) => item.id.toString() === id)

    return scheduling ?? null
  }

  async findAll(): Promise<Scheduling[]> {
    return this.items
  }

  async findByDate(date: Date): Promise<Scheduling[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return this.items.filter((scheduling) => {
      return (
        scheduling.startDate >= startOfDay && scheduling.startDate <= endOfDay
      )
    })
  }

  async findByUserId(userId: string): Promise<Scheduling[]> {
    return this.items.filter(
      (scheduling) => scheduling.userId.toString() === userId,
    )
  }

  async findByEquipmentId(equipmentId: string): Promise<Scheduling[]> {
    return this.items.filter(
      (scheduling) => scheduling.equipmentId.toString() === equipmentId,
    )
  }

  async findActiveByEquipmentIdAndDateRange(
    equipmentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Scheduling[]> {
    return this.items.filter((scheduling) => {
      const isActive = scheduling.isActive
      const matchesEquipment =
        scheduling.equipmentId.toString() === equipmentId

      // Check for date range overlap
      const hasOverlap =
        scheduling.startDate < endDate && scheduling.endDate > startDate

      return isActive && matchesEquipment && hasOverlap
    })
  }

  async delete(scheduling: Scheduling): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(scheduling.id),
    )

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}

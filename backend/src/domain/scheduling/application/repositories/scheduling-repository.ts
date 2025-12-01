import { Scheduling } from '../../enterprise/entities/scheduling.entity'

export abstract class SchedulingRepository {
  abstract create(scheduling: Scheduling): Promise<Scheduling>
  abstract findById(id: string): Promise<Scheduling | null>
  abstract findAll(): Promise<Scheduling[]>
  abstract findByDate(date: Date): Promise<Scheduling[]>
  abstract findByUserId(userId: string): Promise<Scheduling[]>
  abstract findByEquipmentId(equipmentId: string): Promise<Scheduling[]>
  abstract findActiveByEquipmentIdAndDateRange(
    equipmentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Scheduling[]>
  abstract save(scheduling: Scheduling): Promise<void>
  abstract delete(scheduling: Scheduling): Promise<void>
}

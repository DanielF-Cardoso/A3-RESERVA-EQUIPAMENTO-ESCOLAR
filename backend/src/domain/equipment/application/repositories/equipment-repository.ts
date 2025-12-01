import { Equipment } from '../../enterprise/entities/equipment.entity'

export abstract class EquipmentRepository {
  abstract create(equipment: Equipment): Promise<Equipment>
  abstract findById(id: string): Promise<Equipment | null>
  abstract findAll(): Promise<Equipment[]>
  abstract findAllActive(): Promise<Equipment[]>
  abstract save(equipment: Equipment): Promise<void>
  abstract delete(equipment: Equipment): Promise<void>
}

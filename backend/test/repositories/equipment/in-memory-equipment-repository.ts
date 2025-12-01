import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'

export class InMemoryEquipmentRepository implements EquipmentRepository {
  public items: Equipment[] = []

  async create(equipment: Equipment): Promise<Equipment> {
    this.items.push(equipment)
    return equipment
  }

  async save(equipment: Equipment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(equipment.id))

    if (index >= 0) {
      this.items[index] = equipment
    }
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = this.items.find((item) => item.id.toString() === id)

    return equipment ?? null
  }

  async findAll(): Promise<Equipment[]> {
    return this.items
  }

  async findAllActive(): Promise<Equipment[]> {
    return this.items.filter((item) => item.isActive)
  }

  async delete(equipment: Equipment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(equipment.id))

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}

import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'

export class EquipmentPresenter {
  static toHTTP(equipment: Equipment) {
    return {
      id: equipment.id.toString(),
      name: equipment.name,
      type: equipment.type.toValue(),
      quantity: equipment.quantity,
      status: equipment.status.toValue(),
      location: equipment.location ?? null,
      description: equipment.description ?? null,
      isActive: equipment.isActive,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt,
    }
  }
}

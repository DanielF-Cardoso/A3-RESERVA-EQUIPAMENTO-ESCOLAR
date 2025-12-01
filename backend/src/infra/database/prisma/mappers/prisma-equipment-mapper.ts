import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'
import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'
import { Equipment as PrismaEquipment, Prisma } from '@prisma/client'

export class PrismaEquipmentMapper {
  static toDomain(raw: PrismaEquipment): Equipment {
    const equipment = Equipment.create(
      {
        name: raw.name,
        type: new EquipmentType(raw.type),
        quantity: raw.quantity,
        status: new EquipmentStatus(raw.status),
        location: raw.location ?? undefined,
        description: raw.description ?? undefined,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return equipment
  }

  static toPrisma(
    equipment: Equipment,
  ): Prisma.EquipmentUncheckedCreateInput {
    return {
      id: equipment.id.toValue(),
      name: equipment.name,
      type: equipment.type.toValue(),
      quantity: equipment.quantity,
      status: equipment.status.toValue(),
      location: equipment.location ?? null,
      description: equipment.description ?? null,
      isActive: equipment.isActive,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt ?? undefined,
    }
  }
}

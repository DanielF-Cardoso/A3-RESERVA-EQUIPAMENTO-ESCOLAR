import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'
import { Scheduling as PrismaScheduling, Prisma } from '@prisma/client'

export class PrismaSchedulingMapper {
  static toDomain(raw: PrismaScheduling): Scheduling {
    return Scheduling.create(
      {
        equipmentId: new UniqueEntityID(raw.equipmentId),
        userId: new UniqueEntityID(raw.userId),
        startDate: raw.startDate,
        endDate: raw.endDate,
        quantity: raw.quantity,
        notes: raw.notes ?? undefined,
        status: raw.status as 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(scheduling: Scheduling): Prisma.SchedulingUncheckedCreateInput {
    return {
      id: scheduling.id.toValue(),
      equipmentId: scheduling.equipmentId.toValue(),
      userId: scheduling.userId.toValue(),
      startDate: scheduling.startDate,
      endDate: scheduling.endDate,
      quantity: scheduling.quantity,
      notes: scheduling.notes ?? null,
      status: scheduling.status,
      createdAt: scheduling.createdAt,
      updatedAt: scheduling.updatedAt,
    }
  }
}

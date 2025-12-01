import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'

export class SchedulingPresenter {
  static toHTTP(scheduling: Scheduling) {
    return {
      id: scheduling.id.toString(),
      equipmentId: scheduling.equipmentId.toString(),
      userId: scheduling.userId.toString(),
      startDate: scheduling.startDate.toISOString(),
      endDate: scheduling.endDate.toISOString(),
      quantity: scheduling.quantity,
      notes: scheduling.notes ?? null,
      status: scheduling.status,
      isActive: scheduling.isActive,
      isCompleted: scheduling.isCompleted,
      isCancelled: scheduling.isCancelled,
      createdAt: scheduling.createdAt.toISOString(),
      updatedAt: scheduling.updatedAt
        ? scheduling.updatedAt.toISOString()
        : scheduling.createdAt.toISOString(),
    }
  }
}

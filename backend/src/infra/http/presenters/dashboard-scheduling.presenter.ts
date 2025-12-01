import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'

export class DashboardSchedulingPresenter {
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
      createdAt: scheduling.createdAt.toISOString(),
    }
  }
}

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

type SchedulingOverride = {
  equipmentId?: string
  userId?: string
  startDate?: Date
  endDate?: Date
  quantity?: number
  notes?: string
  status?: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

export async function makePrismaScheduling(
  prisma: PrismaClient,
  data: SchedulingOverride = {},
) {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const scheduling = await prisma.scheduling.create({
    data: {
      equipmentId: data.equipmentId ?? faker.string.uuid(),
      userId: data.userId ?? faker.string.uuid(),
      startDate: data.startDate ?? tomorrow,
      endDate: data.endDate ?? dayAfterTomorrow,
      quantity: data.quantity ?? faker.number.int({ min: 1, max: 5 }),
      notes: data.notes ?? faker.lorem.sentence(),
      status: data.status ?? 'SCHEDULED',
    },
  })

  return scheduling
}

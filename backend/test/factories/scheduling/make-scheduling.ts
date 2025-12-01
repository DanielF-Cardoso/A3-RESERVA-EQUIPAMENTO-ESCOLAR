import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Scheduling,
  SchedulingProps,
} from '@/domain/scheduling/enterprise/entities/scheduling.entity'

export function makeScheduling(
  override: Partial<SchedulingProps> = {},
  id?: UniqueEntityID,
) {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const scheduling = Scheduling.create(
    {
      equipmentId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: faker.number.int({ min: 1, max: 5 }),
      notes: faker.lorem.sentence(),
      status: 'SCHEDULED',
      ...override,
    },
    id,
  )

  return scheduling
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateSchedulingService } from './create-scheduling.service'
import { InMemorySchedulingRepository } from '../../../../../test/repositories/scheduling/in-memory-scheduling-repository'
import { InMemoryEquipmentRepository } from '../../../../../test/repositories/equipment/in-memory-equipment-repository'
import { LoggerService } from '@nestjs/common'
import { makeEquipment } from '../../../../../test/factories/equipment/make-equipment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeScheduling } from '../../../../../test/factories/scheduling/make-scheduling'

describe('CreateSchedulingService', () => {
  let sut: CreateSchedulingService
  let schedulingRepository: InMemorySchedulingRepository
  let equipmentRepository: InMemoryEquipmentRepository
  let loggerService: LoggerService

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingRepository()
    equipmentRepository = new InMemoryEquipmentRepository()
    loggerService = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as LoggerService

    sut = new CreateSchedulingService(
      schedulingRepository,
      equipmentRepository,
      loggerService,
    )
  })

  it('should create a scheduling', async () => {
    const equipment = makeEquipment({
      quantity: 10,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 2,
      notes: 'Test scheduling',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.scheduling.quantity).toBe(2)
      expect(schedulingRepository.items).toHaveLength(1)
    }
  })

  it('should not create scheduling if equipment does not exist', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const result = await sut.execute({
      equipmentId: 'non-existent-id',
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 2,
    })

    expect(result.isLeft()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(0)
  })

  it('should not create scheduling if quantity exceeds available', async () => {
    const equipment = makeEquipment({
      quantity: 5,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 10, // More than available
    })

    expect(result.isLeft()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(0)
  })

  it('should consider existing schedulings when calculating available quantity', async () => {
    const equipment = makeEquipment({
      quantity: 10,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Create an existing scheduling with 7 units
    const existingScheduling = makeScheduling({
      equipmentId: equipment.id,
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 7,
      status: 'CONFIRMED',
    })
    await schedulingRepository.create(existingScheduling)

    // Try to schedule 4 more units (total would be 11, but only 10 available)
    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 4,
    })

    expect(result.isLeft()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(1) // Only the existing one
  })

  it('should allow scheduling if quantity is within available range', async () => {
    const equipment = makeEquipment({
      quantity: 10,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Create an existing scheduling with 7 units
    const existingScheduling = makeScheduling({
      equipmentId: equipment.id,
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 7,
      status: 'CONFIRMED',
    })
    await schedulingRepository.create(existingScheduling)

    // Schedule 3 more units (total = 10, which is OK)
    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 3,
    })

    expect(result.isRight()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(2)
  })

  it('should not consider cancelled schedulings when calculating quantity', async () => {
    const equipment = makeEquipment({
      quantity: 10,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Create a cancelled scheduling with 7 units
    const cancelledScheduling = makeScheduling({
      equipmentId: equipment.id,
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 7,
      status: 'CANCELLED',
    })
    await schedulingRepository.create(cancelledScheduling)

    // Should be able to schedule 10 units since cancelled doesn't count
    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 10,
    })

    expect(result.isRight()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(2)
  })

  it('should allow scheduling in non-overlapping date ranges', async () => {
    const equipment = makeEquipment({
      quantity: 10,
    })
    await equipmentRepository.create(equipment)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const threeDaysLater = new Date(tomorrow)
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)
    const fourDaysLater = new Date(tomorrow)
    fourDaysLater.setDate(fourDaysLater.getDate() + 4)

    // Create a scheduling for tomorrow
    const firstScheduling = makeScheduling({
      equipmentId: equipment.id,
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      quantity: 10,
      status: 'CONFIRMED',
    })
    await schedulingRepository.create(firstScheduling)

    // Schedule for 3 days later (non-overlapping)
    const result = await sut.execute({
      equipmentId: equipment.id.toString(),
      userId: new UniqueEntityID().toString(),
      startDate: threeDaysLater,
      endDate: fourDaysLater,
      quantity: 10,
    })

    expect(result.isRight()).toBe(true)
    expect(schedulingRepository.items).toHaveLength(2)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListSchedulingsService } from './list-schedulings.service'
import { InMemorySchedulingRepository } from '../../../../../test/repositories/scheduling/in-memory-scheduling-repository'
import { LoggerService } from '@nestjs/common'
import { makeScheduling } from '../../../../../test/factories/scheduling/make-scheduling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('ListSchedulingsService', () => {
  let sut: ListSchedulingsService
  let schedulingRepository: InMemorySchedulingRepository
  let loggerService: LoggerService

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingRepository()
    loggerService = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as LoggerService

    sut = new ListSchedulingsService(
      schedulingRepository,
      loggerService,
    )
  })

  it('should list all schedulings', async () => {
    const scheduling1 = makeScheduling()
    const scheduling2 = makeScheduling()
    const scheduling3 = makeScheduling()

    await schedulingRepository.create(scheduling1)
    await schedulingRepository.create(scheduling2)
    await schedulingRepository.create(scheduling3)

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.schedulings).toHaveLength(3)
    }
  })

  it('should list schedulings by date', async () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const scheduling1 = makeScheduling({
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
    })
    const scheduling2 = makeScheduling({
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
    })
    const scheduling3 = makeScheduling({
      startDate: new Date(today.setDate(today.getDate() + 5)),
      endDate: new Date(today.setDate(today.getDate() + 6)),
    })

    await schedulingRepository.create(scheduling1)
    await schedulingRepository.create(scheduling2)
    await schedulingRepository.create(scheduling3)

    const result = await sut.execute({ date: tomorrow })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.schedulings).toHaveLength(2)
    }
  })

  it('should list schedulings by userId', async () => {
    const userId = new UniqueEntityID()

    const scheduling1 = makeScheduling({ userId })
    const scheduling2 = makeScheduling({ userId })
    const scheduling3 = makeScheduling({ userId: new UniqueEntityID() })

    await schedulingRepository.create(scheduling1)
    await schedulingRepository.create(scheduling2)
    await schedulingRepository.create(scheduling3)

    const result = await sut.execute({ userId: userId.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.schedulings).toHaveLength(2)
    }
  })

  it('should list schedulings by equipmentId', async () => {
    const equipmentId = new UniqueEntityID()

    const scheduling1 = makeScheduling({ equipmentId })
    const scheduling2 = makeScheduling({ equipmentId })
    const scheduling3 = makeScheduling({ equipmentId: new UniqueEntityID() })

    await schedulingRepository.create(scheduling1)
    await schedulingRepository.create(scheduling2)
    await schedulingRepository.create(scheduling3)

    const result = await sut.execute({ equipmentId: equipmentId.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.schedulings).toHaveLength(2)
    }
  })

  it('should return empty array when no schedulings exist', async () => {
    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.schedulings).toHaveLength(0)
    }
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CancelSchedulingService } from './cancel-scheduling.service'
import { InMemorySchedulingRepository } from '../../../../../test/repositories/scheduling/in-memory-scheduling-repository'
import { LoggerService } from '@nestjs/common'
import { makeScheduling } from '../../../../../test/factories/scheduling/make-scheduling'

describe('CancelSchedulingService', () => {
  let sut: CancelSchedulingService
  let schedulingRepository: InMemorySchedulingRepository
  let loggerService: LoggerService

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingRepository()
    loggerService = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as LoggerService

    sut = new CancelSchedulingService(
      schedulingRepository,
      loggerService,
    )
  })

  it('should cancel a scheduled scheduling as STAFF', async () => {
    const scheduling = makeScheduling({ status: 'SCHEDULED' })
    await schedulingRepository.create(scheduling)

    const result = await sut.execute({
      schedulingId: scheduling.id.toString(),
      userRole: 'STAFF',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.scheduling.status).toBe('CANCELLED')
    }
  })

  it('should cancel a confirmed scheduling as ADMIN', async () => {
    const scheduling = makeScheduling({ status: 'CONFIRMED' })
    await schedulingRepository.create(scheduling)

    const result = await sut.execute({
      schedulingId: scheduling.id.toString(),
      userRole: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.scheduling.status).toBe('CANCELLED')
    }
  })

  it('should not allow TEACHER to cancel scheduling', async () => {
    const scheduling = makeScheduling({ status: 'SCHEDULED' })
    await schedulingRepository.create(scheduling)

    const result = await sut.execute({
      schedulingId: scheduling.id.toString(),
      userRole: 'TEACHER',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not cancel scheduling that does not exist', async () => {
    const result = await sut.execute({
      schedulingId: 'non-existent-id',
      userRole: 'STAFF',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not cancel scheduling that is already cancelled', async () => {
    const scheduling = makeScheduling({ status: 'CANCELLED' })
    await schedulingRepository.create(scheduling)

    const result = await sut.execute({
      schedulingId: scheduling.id.toString(),
      userRole: 'STAFF',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not cancel completed scheduling', async () => {
    const scheduling = makeScheduling({ status: 'COMPLETED' })
    await schedulingRepository.create(scheduling)

    const result = await sut.execute({
      schedulingId: scheduling.id.toString(),
      userRole: 'STAFF',
    })

    expect(result.isLeft()).toBe(true)
  })
})

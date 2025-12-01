import { describe, it, expect, beforeEach } from 'vitest'
import { MarkEquipmentAsMaintenanceService } from './mark-equipment-as-maintenance.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipment.repository'
import { makeEquipment } from 'test/factories/equipment/make-equipment'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'

let sut: MarkEquipmentAsMaintenanceService
let equipmentRepository: InMemoryEquipmentRepository
let logger: FakeLogger

beforeEach(() => {
  equipmentRepository = new InMemoryEquipmentRepository()

  logger = new FakeLogger()

  sut = new MarkEquipmentAsMaintenanceService(
    equipmentRepository,
    logger,
  )
})

describe('MarkEquipmentAsMaintenanceService', () => {
  it('should mark equipment as maintenance', async () => {
    const equipment = makeEquipment({
      status: new EquipmentStatus('AVAILABLE'),
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('MAINTENANCE')
    }
  })

  it('should mark IN_USE equipment as maintenance', async () => {
    const equipment = makeEquipment({
      status: new EquipmentStatus('IN_USE'),
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('MAINTENANCE')
    }
  })

  it('should keep equipment in maintenance if already in maintenance', async () => {
    const equipment = makeEquipment({
      status: new EquipmentStatus('MAINTENANCE'),
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('MAINTENANCE')
    }
  })

  it('should return error when equipment not found', async () => {
    const result = await sut.execute({
      equipmentId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should update updatedAt timestamp', async () => {
    const equipment = makeEquipment()
    await equipmentRepository.create(equipment)

    const originalUpdatedAt = equipment.updatedAt

    // Wait a tiny bit to ensure timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10))

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.updatedAt).toBeDefined()
      if (originalUpdatedAt) {
        expect(
          result.value.equipment.updatedAt!.getTime(),
        ).toBeGreaterThanOrEqual(originalUpdatedAt.getTime())
      }
    }
  })

  it('should persist changes in repository', async () => {
    const equipment = makeEquipment({
      status: new EquipmentStatus('AVAILABLE'),
    })
    await equipmentRepository.create(equipment)

    await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    const savedEquipment = await equipmentRepository.findById(
      equipment.id.toValue(),
    )

    expect(savedEquipment).toBeDefined()
    expect(savedEquipment?.status.toValue()).toBe('MAINTENANCE')
  })
})

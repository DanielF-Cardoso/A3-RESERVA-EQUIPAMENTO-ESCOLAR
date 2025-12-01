import { describe, it, expect, beforeEach } from 'vitest'
import { InactivateEquipmentService } from './inactivate-equipment.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipment.repository'
import { makeEquipment } from 'test/factories/equipment/make-equipment'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

let sut: InactivateEquipmentService
let equipmentRepository: InMemoryEquipmentRepository
let logger: FakeLogger

beforeEach(() => {
  equipmentRepository = new InMemoryEquipmentRepository()


  logger = new FakeLogger()

  sut = new InactivateEquipmentService(equipmentRepository,  logger)
})

describe('InactivateEquipmentService', () => {
  it('should inactivate an active equipment', async () => {
    const equipment = makeEquipment({ isActive: true })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.isActive).toBe(false)
    }
  })

  it('should keep equipment inactive if already inactive', async () => {
    const equipment = makeEquipment({ isActive: false })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.isActive).toBe(false)
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

  it('should persist changes in repository', async () => {
    const equipment = makeEquipment({ isActive: true })
    await equipmentRepository.create(equipment)

    await sut.execute({
      equipmentId: equipment.id.toValue(),
    })

    const savedEquipment = await equipmentRepository.findById(
      equipment.id.toValue(),
    )

    expect(savedEquipment).toBeDefined()
    expect(savedEquipment?.isActive).toBe(false)
  })
})

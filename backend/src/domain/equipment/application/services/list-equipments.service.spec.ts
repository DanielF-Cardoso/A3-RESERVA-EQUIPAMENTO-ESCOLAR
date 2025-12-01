import { describe, it, expect, beforeEach } from 'vitest'
import { ListEquipmentsService } from './list-equipments.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipment.repository'
import { makeEquipment } from 'test/factories/equipment/make-equipment'

let sut: ListEquipmentsService
let equipmentRepository: InMemoryEquipmentRepository
let logger: FakeLogger

beforeEach(() => {
  equipmentRepository = new InMemoryEquipmentRepository()


  logger = new FakeLogger()

  sut = new ListEquipmentsService(equipmentRepository,  logger)
})

describe('ListEquipmentsService', () => {
  it('should list all equipments', async () => {
    const equipment1 = makeEquipment({ name: 'Projetor' })
    const equipment2 = makeEquipment({ name: 'Notebook' })
    const equipment3 = makeEquipment({ name: 'Quadro Branco' })

    await equipmentRepository.create(equipment1)
    await equipmentRepository.create(equipment2)
    await equipmentRepository.create(equipment3)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipments).toHaveLength(3)
      expect(result.value.equipments).toEqual([
        equipment1,
        equipment2,
        equipment3,
      ])
    }
  })

  it('should return empty array when no equipments exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipments).toHaveLength(0)
      expect(result.value.equipments).toEqual([])
    }
  })

  it('should list both active and inactive equipments', async () => {
    const activeEquipment = makeEquipment({ isActive: true })
    const inactiveEquipment = makeEquipment({ isActive: false })

    await equipmentRepository.create(activeEquipment)
    await equipmentRepository.create(inactiveEquipment)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipments).toHaveLength(2)
    }
  })

  it('should list equipments with different statuses', async () => {
    const availableEquipment = makeEquipment()
    const inUseEquipment = makeEquipment()
    const maintenanceEquipment = makeEquipment()

    await equipmentRepository.create(availableEquipment)
    await equipmentRepository.create(inUseEquipment)
    await equipmentRepository.create(maintenanceEquipment)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipments).toHaveLength(3)
    }
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateEquipmentService } from './update-equipment.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipment.repository'
import { makeEquipment } from 'test/factories/equipment/make-equipment'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'

let sut: UpdateEquipmentService
let equipmentRepository: InMemoryEquipmentRepository
let logger: FakeLogger

beforeEach(() => {
  equipmentRepository = new InMemoryEquipmentRepository()


  logger = new FakeLogger()

  sut = new UpdateEquipmentService(equipmentRepository,  logger)
})

describe('UpdateEquipmentService', () => {
  it('should update equipment name', async () => {
    const equipment = makeEquipment({ name: 'Projetor Antigo' })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      name: 'Projetor Novo',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.name).toBe('Projetor Novo')
    }
  })

  it('should update equipment type', async () => {
    const equipment = makeEquipment({
      type: new EquipmentType('Audiovisual'),
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      type: 'Informática',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.type.toValue()).toBe('Informática')
    }
  })

  it('should update equipment quantity', async () => {
    const equipment = makeEquipment({ quantity: 5 })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      quantity: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.quantity).toBe(10)
    }
  })

  it('should update equipment status', async () => {
    const equipment = makeEquipment({
      status: new EquipmentStatus('AVAILABLE'),
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      status: 'IN_USE',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('IN_USE')
    }
  })

  it('should update equipment location', async () => {
    const equipment = makeEquipment({ location: 'Sala 101' })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      location: 'Sala 202',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.location).toBe('Sala 202')
    }
  })

  it('should update equipment description', async () => {
    const equipment = makeEquipment({ description: 'Descrição antiga' })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      description: 'Descrição nova',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.description).toBe('Descrição nova')
    }
  })

  it('should update multiple fields at once', async () => {
    const equipment = makeEquipment({
      name: 'Nome Antigo',
      quantity: 5,
      location: 'Sala 101',
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      name: 'Nome Novo',
      quantity: 15,
      location: 'Sala 303',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.name).toBe('Nome Novo')
      expect(result.value.equipment.quantity).toBe(15)
      expect(result.value.equipment.location).toBe('Sala 303')
    }
  })

  it('should remove location when set to null', async () => {
    const equipment = makeEquipment({ location: 'Sala 101' })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      location: null,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.location).toBeUndefined()
    }
  })

  it('should remove description when set to null', async () => {
    const equipment = makeEquipment({ description: 'Alguma descrição' })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      description: null,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.description).toBeUndefined()
    }
  })

  it('should keep existing values when not provided', async () => {
    const equipment = makeEquipment({
      name: 'Projetor',
      type: new EquipmentType('Audiovisual'),
      quantity: 5,
      location: 'Sala 101',
    })
    await equipmentRepository.create(equipment)

    const result = await sut.execute({
      equipmentId: equipment.id.toValue(),
      name: 'Projetor Atualizado',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.name).toBe('Projetor Atualizado')
      expect(result.value.equipment.type.toValue()).toBe('Audiovisual')
      expect(result.value.equipment.quantity).toBe(5)
      expect(result.value.equipment.location).toBe('Sala 101')
    }
  })

  it('should return error when equipment not found', async () => {
    const result = await sut.execute({
      equipmentId: 'non-existent-id',
      name: 'Novo Nome',
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
      name: 'Nome Atualizado',
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
})

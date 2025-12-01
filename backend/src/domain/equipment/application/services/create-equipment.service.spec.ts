import { describe, it, expect, beforeEach } from 'vitest'
import { CreateEquipmentService } from './create-equipment.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipment.repository'

let sut: CreateEquipmentService
let equipmentRepository: InMemoryEquipmentRepository
let logger: FakeLogger

beforeEach(() => {
  equipmentRepository = new InMemoryEquipmentRepository()

  logger = new FakeLogger()

  sut = new CreateEquipmentService(equipmentRepository, logger)
})

describe('CreateEquipmentService', () => {
  it('should create a new equipment with AVAILABLE status by default', async () => {
    const result = await sut.execute({
      name: 'Projetor Multimídia',
      type: 'Audiovisual',
      quantity: 5,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment).toBeDefined()
      expect(result.value.equipment.name).toBe('Projetor Multimídia')
      expect(result.value.equipment.type.toValue()).toBe('Audiovisual')
      expect(result.value.equipment.quantity).toBe(5)
      expect(result.value.equipment.status.toValue()).toBe('AVAILABLE')
      expect(equipmentRepository.items).toHaveLength(1)
    }
  })

  it('should create equipment with IN_USE status when specified', async () => {
    const result = await sut.execute({
      name: 'Notebook Dell',
      type: 'Informática',
      quantity: 10,
      status: 'IN_USE',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('IN_USE')
    }
  })

  it('should create equipment with MAINTENANCE status when specified', async () => {
    const result = await sut.execute({
      name: 'Microscópio',
      type: 'Laboratório',
      quantity: 3,
      status: 'MAINTENANCE',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.status.toValue()).toBe('MAINTENANCE')
    }
  })

  it('should create equipment with location when provided', async () => {
    const result = await sut.execute({
      name: 'Quadro Branco',
      type: 'Mobiliário',
      quantity: 15,
      location: 'Sala 101',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.location).toBe('Sala 101')
    }
  })

  it('should create equipment with description when provided', async () => {
    const result = await sut.execute({
      name: 'Calculadora Científica',
      type: 'Eletrônico',
      quantity: 50,
      description: 'Calculadora Casio FX-82MS para aulas de matemática',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.description).toBe(
        'Calculadora Casio FX-82MS para aulas de matemática',
      )
    }
  })

  it('should create equipment with both location and description', async () => {
    const result = await sut.execute({
      name: 'Tablet Samsung',
      type: 'Informática',
      quantity: 20,
      location: 'Laboratório de Informática',
      description: 'Tablets para atividades educacionais',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.location).toBe(
        'Laboratório de Informática',
      )
      expect(result.value.equipment.description).toBe(
        'Tablets para atividades educacionais',
      )
    }
  })

  it('should create equipment without location (optional field)', async () => {
    const result = await sut.execute({
      name: 'Livro Didático',
      type: 'Material',
      quantity: 100,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.location).toBeUndefined()
    }
  })

  it('should create equipment without description (optional field)', async () => {
    const result = await sut.execute({
      name: 'Cadeira',
      type: 'Mobiliário',
      quantity: 200,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.description).toBeUndefined()
    }
  })

  it('should create equipment with quantity zero', async () => {
    const result = await sut.execute({
      name: 'Equipamento Esgotado',
      type: 'Diversos',
      quantity: 0,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.quantity).toBe(0)
    }
  })

  it('should create equipment and mark it as active by default', async () => {
    const result = await sut.execute({
      name: 'Projetor',
      type: 'Audiovisual',
      quantity: 3,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.isActive).toBe(true)
    }
  })

  it('should trim equipment name', async () => {
    const result = await sut.execute({
      name: '  Projetor com espaços  ',
      type: 'Audiovisual',
      quantity: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.name).toBe('Projetor com espaços')
    }
  })

  it('should trim equipment type', async () => {
    const result = await sut.execute({
      name: 'Equipamento',
      type: '  Audiovisual  ',
      quantity: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.equipment.type.toValue()).toBe('Audiovisual')
    }
  })
})

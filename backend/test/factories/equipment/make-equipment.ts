import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'

interface Override {
  name?: string
  type?: EquipmentType
  quantity?: number
  status?: EquipmentStatus
  location?: string | null
  description?: string | null
  isActive?: boolean
}

export function makeEquipment(
  override: Override = {},
  id?: UniqueEntityID,
): Equipment {
  const name =
    override.name ??
    faker.helpers.arrayElement([
      'Projetor Multimídia',
      'Notebook Dell',
      'Quadro Branco',
      'Microscópio',
      'Calculadora Científica',
      'Tablet Samsung',
    ])

  const type =
    override.type ??
    new EquipmentType(
      faker.helpers.arrayElement([
        'Eletrônico',
        'Mobiliário',
        'Laboratório',
        'Informática',
        'Audiovisual',
      ]),
    )

  const quantity = override.quantity ?? faker.number.int({ min: 1, max: 50 })

  const status =
    override.status ??
    new EquipmentStatus(
      faker.helpers.arrayElement(['AVAILABLE', 'IN_USE', 'MAINTENANCE']),
    )

  const location =
    override.location !== undefined
      ? override.location
      : faker.helpers.maybe(
          () =>
            faker.helpers.arrayElement([
              'Sala 101',
              'Laboratório de Informática',
              'Biblioteca',
              'Sala dos Professores',
              'Almoxarifado',
            ]),
          { probability: 0.7 },
        )

  const description =
    override.description !== undefined
      ? override.description
      : faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 })

  return Equipment.create(
    {
      name,
      type,
      quantity,
      status,
      location: location ?? undefined,
      description: description ?? undefined,
      isActive: override.isActive ?? true,
    },
    id,
  )
}

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'
import { PrismaEquipmentMapper } from '@/infra/database/prisma/mappers/prisma-equipment-mapper'

export interface MakePrismaEquipmentParams {
  name?: string
  type?: string
  quantity?: number
  status?: string
  location?: string
  description?: string
  isActive?: boolean
}

@Injectable()
export class EquipmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEquipment(
    data: MakePrismaEquipmentParams = {},
  ): Promise<Equipment> {
    const equipment = Equipment.create(
      {
        name: data.name || 'Projetor Multimídia',
        type: new EquipmentType(data.type || 'Audiovisual'),
        quantity: data.quantity !== undefined ? data.quantity : 10,
        status: new EquipmentStatus(data.status || 'AVAILABLE'),
        location: data.location,
        description: data.description,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      new UniqueEntityID(),
    )

    const prismaEquipment = PrismaEquipmentMapper.toPrisma(equipment)

    await this.prisma.equipment.create({
      data: prismaEquipment,
    })

    return equipment
  }
}

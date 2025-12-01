import { Injectable } from '@nestjs/common'
import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { Equipment } from '@/domain/equipment/enterprise/entities/equipment.entity'
import { PrismaEquipmentMapper } from '../mappers/prisma-equipment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEquipmentRepository implements EquipmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(equipment: Equipment): Promise<Equipment> {
    const data = PrismaEquipmentMapper.toPrisma(equipment)

    const createdEquipment = await this.prisma.equipment.create({ data })

    return PrismaEquipmentMapper.toDomain(createdEquipment)
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    })

    if (!equipment) return null

    return PrismaEquipmentMapper.toDomain(equipment)
  }

  async findAll(): Promise<Equipment[]> {
    const equipments = await this.prisma.equipment.findMany()
    return equipments.map(PrismaEquipmentMapper.toDomain)
  }

  async findAllActive(): Promise<Equipment[]> {
    const equipments = await this.prisma.equipment.findMany({
      where: { isActive: true },
    })
    return equipments.map(PrismaEquipmentMapper.toDomain)
  }

  async save(equipment: Equipment): Promise<void> {
    const data = PrismaEquipmentMapper.toPrisma(equipment)

    await this.prisma.equipment.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(equipment: Equipment): Promise<void> {
    await this.prisma.equipment.delete({
      where: { id: equipment.id.toString() },
    })
  }
}

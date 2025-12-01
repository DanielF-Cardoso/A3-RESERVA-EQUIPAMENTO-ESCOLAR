import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SchedulingRepository } from '@/domain/scheduling/application/repositories/scheduling-repository'
import { Scheduling } from '@/domain/scheduling/enterprise/entities/scheduling.entity'
import { PrismaSchedulingMapper } from '../mappers/prisma-scheduling-mapper'

@Injectable()
export class PrismaSchedulingRepository implements SchedulingRepository {
  constructor(private prisma: PrismaService) {}

  async create(scheduling: Scheduling): Promise<Scheduling> {
    const data = PrismaSchedulingMapper.toPrisma(scheduling)

    const created = await this.prisma.scheduling.create({
      data,
    })

    return PrismaSchedulingMapper.toDomain(created)
  }

  async save(scheduling: Scheduling): Promise<void> {
    const data = PrismaSchedulingMapper.toPrisma(scheduling)

    await this.prisma.scheduling.update({
      where: { id: scheduling.id.toString() },
      data,
    })
  }

  async findById(id: string): Promise<Scheduling | null> {
    const scheduling = await this.prisma.scheduling.findUnique({
      where: { id },
    })

    if (!scheduling) {
      return null
    }

    return PrismaSchedulingMapper.toDomain(scheduling)
  }

  async findAll(): Promise<Scheduling[]> {
    const schedulings = await this.prisma.scheduling.findMany({
      orderBy: { startDate: 'asc' },
    })

    return schedulings.map(PrismaSchedulingMapper.toDomain)
  }

  async findByDate(date: Date): Promise<Scheduling[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const schedulings = await this.prisma.scheduling.findMany({
      where: {
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startDate: 'asc' },
    })

    return schedulings.map(PrismaSchedulingMapper.toDomain)
  }

  async findByUserId(userId: string): Promise<Scheduling[]> {
    const schedulings = await this.prisma.scheduling.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    })

    return schedulings.map(PrismaSchedulingMapper.toDomain)
  }

  async findByEquipmentId(equipmentId: string): Promise<Scheduling[]> {
    const schedulings = await this.prisma.scheduling.findMany({
      where: { equipmentId },
      orderBy: { startDate: 'asc' },
    })

    return schedulings.map(PrismaSchedulingMapper.toDomain)
  }

  async findActiveByEquipmentIdAndDateRange(
    equipmentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Scheduling[]> {
    const schedulings = await this.prisma.scheduling.findMany({
      where: {
        equipmentId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
        AND: [
          {
            startDate: {
              lt: endDate,
            },
          },
          {
            endDate: {
              gt: startDate,
            },
          },
        ],
      },
    })

    return schedulings.map(PrismaSchedulingMapper.toDomain)
  }

  async delete(scheduling: Scheduling): Promise<void> {
    await this.prisma.scheduling.delete({
      where: { id: scheduling.id.toString() },
    })
  }
}

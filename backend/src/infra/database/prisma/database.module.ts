import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaClient } from '@prisma/client'
import { PrismaUserRepository } from './repositories/prisma-user.repository'
import { UserRepository } from '@/domain/user/application/repositories/user-repository'
import { PrismaEquipmentRepository } from './repositories/prisma-equipment.repository'
import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { PrismaSchedulingRepository } from './repositories/prisma-scheduling-repository'
import { SchedulingRepository } from '@/domain/scheduling/application/repositories/scheduling-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: EquipmentRepository,
      useClass: PrismaEquipmentRepository,
    },
    {
      provide: SchedulingRepository,
      useClass: PrismaSchedulingRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    EquipmentRepository,
    SchedulingRepository,
  ],
})
export class DatabaseModule {}

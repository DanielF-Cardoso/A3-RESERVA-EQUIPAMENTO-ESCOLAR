import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { EquipmentFactory } from 'test/factories/equipment/make-equipment-prisma'
import { makePrismaScheduling } from 'test/factories/scheduling/make-scheduling-prisma'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/prisma/database.module'

describe('Cancel Scheduling (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let equipmentFactory: EquipmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, EquipmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[PATCH] /schedulings/:id/cancel - should cancel as STAFF', async () => {
    const staff = await userFactory.makePrismaUser({
      role: 'STAFF',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const scheduling = await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: staff.id.toString(),
      status: 'SCHEDULED',
    })

    const accessToken = jwt.sign({ sub: staff.id.toString(), role: staff.role.toValue() })

    const response = await request(app.getHttpServer())
      .patch(`/schedulings/${scheduling.id}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.scheduling.status).toBe('CANCELLED')

    const schedulingOnDatabase = await prisma.scheduling.findUnique({
      where: { id: scheduling.id },
    })

    expect(schedulingOnDatabase?.status).toBe('CANCELLED')
  })

  it('[PATCH] /schedulings/:id/cancel - should cancel as ADMIN', async () => {
    const admin = await userFactory.makePrismaUser({
      role: 'ADMIN',
      email: 'admin-cancel@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const scheduling = await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: admin.id.toString(),
      status: 'CONFIRMED',
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role.toValue() })

    const response = await request(app.getHttpServer())
      .patch(`/schedulings/${scheduling.id}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.scheduling.status).toBe('CANCELLED')
  })

  it('[PATCH] /schedulings/:id/cancel - should return 403 for TEACHER', async () => {
    const teacher = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'teacher-cancel@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const scheduling = await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: teacher.id.toString(),
      status: 'SCHEDULED',
    })

    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      role: teacher.role.toValue(),
    })

    const response = await request(app.getHttpServer())
      .patch(`/schedulings/${scheduling.id}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})

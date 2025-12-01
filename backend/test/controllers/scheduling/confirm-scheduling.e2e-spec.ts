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

describe('Confirm Scheduling (E2E)', () => {
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

  it('[PATCH] /schedulings/:id/confirm - should confirm as STAFF', async () => {
    const staff = await userFactory.makePrismaUser({
      role: 'STAFF',
      email: 'staff-confirm@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const scheduling = await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: staff.id.toString(),
      status: 'SCHEDULED',
    })

    const accessToken = jwt.sign({ sub: staff.id.toString(), role: staff.role.toValue() })

    const response = await request(app.getHttpServer())
      .patch(`/schedulings/${scheduling.id}/confirm`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.scheduling.status).toBe('CONFIRMED')

    const schedulingOnDatabase = await prisma.scheduling.findUnique({
      where: { id: scheduling.id },
    })

    expect(schedulingOnDatabase?.status).toBe('CONFIRMED')
  })

  it('[PATCH] /schedulings/:id/confirm - should confirm as ADMIN', async () => {
    const admin = await userFactory.makePrismaUser({
      role: 'ADMIN',
      email: 'admin-confirm@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const scheduling = await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: admin.id.toString(),
      status: 'SCHEDULED',
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role.toValue() })

    const response = await request(app.getHttpServer())
      .patch(`/schedulings/${scheduling.id}/confirm`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.scheduling.status).toBe('CONFIRMED')
  })

  it('[PATCH] /schedulings/:id/confirm - should return 403 for TEACHER', async () => {
    const teacher = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'teacher-confirm@escola.com',
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
      .patch(`/schedulings/${scheduling.id}/confirm`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})

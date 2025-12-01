import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { EquipmentFactory } from 'test/factories/equipment/make-equipment-prisma'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/prisma/database.module'

describe('Create Scheduling (E2E)', () => {
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

  it('[POST] /schedulings', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'TEACHER',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      quantity: 10,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role.toValue() })

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const response = await request(app.getHttpServer())
      .post('/schedulings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        equipmentId: equipment.id.toString(),
        startDate: tomorrow.toISOString(),
        endDate: dayAfterTomorrow.toISOString(),
        quantity: 2,
        notes: 'Need for math class',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.scheduling).toMatchObject({
      equipmentId: equipment.id.toString(),
      userId: user.id.toString(),
      quantity: 2,
      status: 'SCHEDULED',
    })

    const schedulingOnDatabase = await prisma.scheduling.findFirst({
      where: {
        equipmentId: equipment.id.toString(),
        userId: user.id.toString(),
      },
    })

    expect(schedulingOnDatabase).toBeTruthy()
  })

  it('[POST] /schedulings - should return 409 when insufficient quantity', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'user-insufficient@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      quantity: 5,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role.toValue() })

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const response = await request(app.getHttpServer())
      .post('/schedulings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        equipmentId: equipment.id.toString(),
        startDate: tomorrow.toISOString(),
        endDate: dayAfterTomorrow.toISOString(),
        quantity: 10, // More than available
        notes: 'Need for math class',
      })

    expect(response.statusCode).toBe(409)
  })
})

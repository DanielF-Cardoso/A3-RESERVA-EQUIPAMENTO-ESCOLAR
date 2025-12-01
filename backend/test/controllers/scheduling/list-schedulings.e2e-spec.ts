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

describe('List Schedulings (E2E)', () => {
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

  it('[GET] /schedulings', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'user-list@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: user.id.toString(),
    })

    await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: user.id.toString(),
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role.toValue() })

    const response = await request(app.getHttpServer())
      .get('/schedulings')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.schedulings).toHaveLength(2)
  })

  it('[GET] /schedulings?userId=...', async () => {
    const user1 = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'user1-list@escola.com',
    })

    const user2 = await userFactory.makePrismaUser({
      role: 'TEACHER',
      email: 'user2-list@escola.com',
    })

    const equipment = await equipmentFactory.makePrismaEquipment()

    await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: user1.id.toString(),
    })

    await makePrismaScheduling(prisma, {
      equipmentId: equipment.id.toString(),
      userId: user2.id.toString(),
    })

    const accessToken = jwt.sign({
      sub: user1.id.toString(),
      role: user1.role.toValue(),
    })

    const response = await request(app.getHttpServer())
      .get('/schedulings')
      .query({ userId: user1.id.toString() })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.schedulings).toHaveLength(1)
    expect(response.body.schedulings[0].userId).toBe(user1.id.toString())
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { EquipmentFactory } from 'test/factories/equipment/make-equipment-prisma'
import { hash } from 'bcryptjs'

describe('List Equipments Controller (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let equipmentFactory: EquipmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, EquipmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()

    userFactory = moduleRef.get(UserFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /equipments', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    await equipmentFactory.makePrismaEquipment({
      name: 'Projetor 1',
      type: 'Audiovisual',
      quantity: 5,
    })

    await equipmentFactory.makePrismaEquipment({
      name: 'Notebook 1',
      type: 'Informática',
      quantity: 10,
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .get('/equipments')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.equipments).toHaveLength(2)
    expect(result.body).toEqual({
      equipments: expect.arrayContaining([
        expect.objectContaining({
          name: 'Projetor 1',
          type: 'Audiovisual',
          quantity: 5,
        }),
        expect.objectContaining({
          name: 'Notebook 1',
          type: 'Informática',
          quantity: 10,
        }),
      ]),
    })
  })

  test('[GET] /equipments - should return 401 without authentication', async () => {
    const result = await request(app.getHttpServer()).get('/equipments')

    expect(result.status).toBe(401)
  })

  test('[GET] /equipments - should include inactive equipments', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin2@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    await equipmentFactory.makePrismaEquipment({
      name: 'Equipamento Ativo',
      isActive: true,
    })

    await equipmentFactory.makePrismaEquipment({
      name: 'Equipamento Inativo',
      isActive: false,
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .get('/equipments')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.equipments.length).toBeGreaterThanOrEqual(2)
  })
})

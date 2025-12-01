import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { EquipmentFactory } from 'test/factories/equipment/make-equipment-prisma'
import { hash } from 'bcryptjs'

describe('Update Equipment Controller (E2E)', () => {
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

  test('[PATCH] /equipments/:id', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      name: 'Projetor Antigo',
      type: 'Audiovisual',
      quantity: 5,
      location: 'Sala 101',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Projetor Novo',
        quantity: 10,
        location: 'Sala 202',
      })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      equipment: expect.objectContaining({
        id: equipment.id.toString(),
        name: 'Projetor Novo',
        type: 'Audiovisual',
        quantity: 10,
        location: 'Sala 202',
      }),
    })
  })

  test('[PATCH] /equipments/:id - should remove location when set to null', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin2@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      name: 'Notebook',
      location: 'Sala 101',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        location: null,
      })

    expect(result.status).toBe(200)
    expect(result.body.equipment.location).toBeNull()
  })

  test('[PATCH] /equipments/:id - should return 404 for non-existent equipment', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin3@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/equipments/non-existent-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Novo Nome',
      })

    expect(result.status).toBe(404)
  })

  test('[PATCH] /equipments/:id - should return 401 without authentication', async () => {
    const equipment = await equipmentFactory.makePrismaEquipment()

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}`)
      .send({
        name: 'Novo Nome',
      })

    expect(result.status).toBe(401)
  })

  test('[PATCH] /equipments/:id - should update status', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin4@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      status: 'AVAILABLE',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'IN_USE',
      })

    expect(result.status).toBe(200)
    expect(result.body.equipment.status).toBe('IN_USE')
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { EquipmentFactory } from 'test/factories/equipment/make-equipment-prisma'
import { hash } from 'bcryptjs'

describe('Mark Equipment As Maintenance Controller (E2E)', () => {
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

  test('[PATCH] /equipments/:id/maintenance', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      name: 'Projetor',
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
      .patch(`/equipments/${equipment.id.toString()}/maintenance`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      equipment: expect.objectContaining({
        id: equipment.id.toString(),
        status: 'MAINTENANCE',
      }),
    })
  })

  test('[PATCH] /equipments/:id/maintenance - should mark IN_USE equipment as maintenance', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin2@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      status: 'IN_USE',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}/maintenance`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.equipment.status).toBe('MAINTENANCE')
  })

  test('[PATCH] /equipments/:id/maintenance - should return 404 for non-existent equipment', async () => {
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
      .patch('/equipments/non-existent-id/maintenance')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(404)
  })

  test('[PATCH] /equipments/:id/maintenance - should return 401 without authentication', async () => {
    const equipment = await equipmentFactory.makePrismaEquipment()

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}/maintenance`)

    expect(result.status).toBe(401)
  })

  test('[PATCH] /equipments/:id/maintenance - should keep equipment in maintenance if already in maintenance', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin4@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const equipment = await equipmentFactory.makePrismaEquipment({
      status: 'MAINTENANCE',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/equipments/${equipment.id.toString()}/maintenance`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.equipment.status).toBe('MAINTENANCE')
  })
})

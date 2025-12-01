import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Create Equipment Controller (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
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
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /equipments', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin@escola.com',
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
      .post('/equipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Projetor Multimídia Epson',
        type: 'Audiovisual',
        quantity: 10,
        status: 'AVAILABLE',
        location: 'Sala 101',
        description: 'Projetor de alta resolução',
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      equipment: expect.objectContaining({
        id: expect.any(String),
        name: 'Projetor Multimídia Epson',
        type: 'Audiovisual',
        quantity: 10,
        status: 'AVAILABLE',
        location: 'Sala 101',
        description: 'Projetor de alta resolução',
        isActive: true,
      }),
    })
  })

  test('[POST] /equipments - should create equipment without optional fields', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin2@escola.com',
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
      .post('/equipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Notebook Dell',
        type: 'Informática',
        quantity: 15,
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      equipment: expect.objectContaining({
        id: expect.any(String),
        name: 'Notebook Dell',
        type: 'Informática',
        quantity: 15,
        status: 'AVAILABLE',
        location: null,
        description: null,
        isActive: true,
      }),
    })
  })

  test('[POST] /equipments - should return 401 without authentication', async () => {
    const result = await request(app.getHttpServer())
      .post('/equipments')
      .send({
        name: 'Projetor',
        type: 'Audiovisual',
        quantity: 5,
      })

    expect(result.status).toBe(401)
  })

  test('[POST] /equipments - should return 400 for invalid data', async () => {
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
      .post('/equipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'A', // Nome muito curto
        type: 'Audiovisual',
        quantity: 10,
      })

    expect(result.status).toBe(400)
  })
})

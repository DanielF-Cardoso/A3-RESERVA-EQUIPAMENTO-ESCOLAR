import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Create User Controller (E2E)', () => {
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

  test('[POST] /api/v1/users', async () => {
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
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'João Silva Santos',
        email: 'joao.silva@escola.com',
        password: 'password123',
        phone: '11999999999',
        role: 'TEACHER',
      })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        fullName: 'João Silva Santos',
        email: 'joao.silva@escola.com',
        phone: '11999999999',
        role: 'TEACHER',
        isActive: true,
      }),
    })
  })

  test('[POST] /api/v1/users - should return 409 for duplicate email', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin2@escola.com',
      password: await hash('admin123', 8),
      role: 'ADMIN',
    })

    const existingUser = await userFactory.makePrismaUser({
      email: 'existing@escola.com',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'admin123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'Maria Santos',
        email: existingUser.email.toValue(),
        password: 'password123',
      })

    expect(result.status).toBe(409)
  })
})

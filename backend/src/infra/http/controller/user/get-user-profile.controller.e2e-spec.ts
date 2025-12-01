import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Get User Profile Controller (E2E)', () => {
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

  test('[GET] /api/v1/users/me', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'profile@escola.com',
      password: await hash('password123', 8),
      fullName: 'Maria Silva Santos',
      phone: '11988888888',
      role: 'STAFF',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      user: expect.objectContaining({
        id: user.id.toString(),
        fullName: 'Maria Silva Santos',
        email: 'profile@escola.com',
        phone: '11988888888',
        role: 'STAFF',
        isActive: true,
      }),
    })
  })

  test('[GET] /api/v1/users/me - should return 401 without token', async () => {
    const result = await request(app.getHttpServer()).get('/users/me')

    expect(result.status).toBe(401)
  })
})

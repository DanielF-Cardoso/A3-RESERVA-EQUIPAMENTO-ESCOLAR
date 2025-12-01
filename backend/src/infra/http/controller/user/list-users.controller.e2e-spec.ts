import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('List Users Controller (E2E)', () => {
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

  test('[GET] /api/v1/users', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'list-admin@escola.com',
      password: await hash('password123', 8),
      role: 'ADMIN',
    })

    await userFactory.makePrismaUser({
      email: 'user1@escola.com',
      fullName: 'User One',
    })

    await userFactory.makePrismaUser({
      email: 'user2@escola.com',
      fullName: 'User Two',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(200)
    expect(result.body.users).toHaveLength(3)
    expect(result.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'list-admin@escola.com',
        }),
        expect.objectContaining({
          email: 'user1@escola.com',
          fullName: 'User One',
        }),
        expect.objectContaining({
          email: 'user2@escola.com',
          fullName: 'User Two',
        }),
      ]),
    )
  })

  test('[GET] /api/v1/users - should return 401 without token', async () => {
    const result = await request(app.getHttpServer()).get('/users')

    expect(result.status).toBe(401)
  })
})

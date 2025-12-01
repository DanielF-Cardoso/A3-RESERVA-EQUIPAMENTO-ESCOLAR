import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Authenticate User Controller (E2E)', () => {
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

  test('[POST] /api/v1/login', async () => {
    const email = 'test@escola.com'
    const password = 'admin123'

    const user = await userFactory.makePrismaUser({
      email,
      password: await hash(password, 8),
      role: 'ADMIN',
    })

    const result = await request(app.getHttpServer())
      .post('/login')
      .send({ email: user.email.toValue(), password })

    expect(result.status).toBe(201)
    expect(result.body).toEqual({
      accessToken: expect.any(String),
      role: 'ADMIN',
    })
  })

  test('[POST] /api/v1/login - should return 400 for invalid credentials', async () => {
    const email = 'test2@escola.com'
    const password = 'admin123'

    await userFactory.makePrismaUser({
      email,
      password: await hash(password, 8),
    })

    const result = await request(app.getHttpServer())
      .post('/login')
      .send({ email, password: 'wrongpassword' })

    expect(result.status).toBe(400)
  })

  test('[POST] /api/v1/login - should return 401 for inactive user', async () => {
    const email = 'inactive@escola.com'
    const password = 'admin123'

    const user = await userFactory.makePrismaUser({
      email,
      password: await hash(password, 8),
      isActive: false,
    })

    const result = await request(app.getHttpServer())
      .post('/login')
      .send({ email: user.email.toValue(), password })

    expect(result.status).toBe(401)
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Update User Profile Controller (E2E)', () => {
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

  test('[PATCH] /api/v1/users/me', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'update-profile@escola.com',
      password: await hash('password123', 8),
      fullName: 'Old Name',
      phone: '11999999999',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'New Name Silva',
        phone: '11988888888',
      })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      user: expect.objectContaining({
        fullName: 'New Name Silva',
        phone: '11988888888',
        email: 'update-profile@escola.com',
      }),
    })
  })

  test('[PATCH] /api/v1/users/me - should update email', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'old-email@escola.com',
      password: await hash('password123', 8),
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'new-email@escola.com',
      })

    expect(result.status).toBe(200)
    expect(result.body.user.email).toBe('new-email@escola.com')
  })

  test('[PATCH] /api/v1/users/me - should remove phone', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'remove-phone@escola.com',
      password: await hash('password123', 8),
      phone: '11999999999',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        phone: '',
      })

    expect(result.status).toBe(200)
    expect(result.body.user.phone).toBeNull()
  })

  test('[PATCH] /api/v1/users/me - should return 409 for duplicate email', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'user1@escola.com',
      password: await hash('password123', 8),
    })

    const existingUser = await userFactory.makePrismaUser({
      email: 'existing-user@escola.com',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: existingUser.email.toValue(),
      })

    expect(result.status).toBe(409)
  })
})

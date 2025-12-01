import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/user/make-user-prisma'
import { hash } from 'bcryptjs'

describe('Inactivate User Controller (E2E)', () => {
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

  test('[PATCH] /api/v1/users/inactivate/:id', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin-inactivate@escola.com',
      password: await hash('password123', 8),
      role: 'ADMIN',
    })

    const targetUser = await userFactory.makePrismaUser({
      email: 'target@escola.com',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/users/inactivate/${targetUser.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(204)
  })

  test('[PATCH] /api/v1/users/inactivate/:id - should return 403 when trying to inactivate own account', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'self-inactivate@escola.com',
      password: await hash('password123', 8),
      role: 'ADMIN',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch(`/users/inactivate/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(403)
  })

  test('[PATCH] /api/v1/users/inactivate/:id - should return 404 for non-existent user', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'admin-notfound@escola.com',
      password: await hash('password123', 8),
      role: 'ADMIN',
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: user.email.toValue(),
        password: 'password123',
      })

    const { accessToken } = loginResponse.body

    const result = await request(app.getHttpServer())
      .patch('/users/inactivate/non-existent-id')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.status).toBe(404)
  })
})

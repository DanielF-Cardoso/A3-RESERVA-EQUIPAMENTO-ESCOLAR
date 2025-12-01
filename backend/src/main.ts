import { NestFactory } from '@nestjs/core'
import { EnvService } from './infra/env/env.service'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppLogger } from './infra/logger/app-logger.service'
import { LoggingInterceptor } from './infra/logger/logging.interceptor'
import { GlobalExceptionFilter } from './infra/filters/global-exception.filter'
import { LOGGER_SERVICE } from './infra/logger/logger.module'
import { RequestContext } from '@/infra/logger/request-context'
import { RequestIdInterceptor } from './infra/logger/request-id.interceptor'
import { AppModule } from './infra/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  const envService = app.get(EnvService)
  const logger = app.get(AppLogger)

  app.useLogger(logger)

  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend Next.js
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-User-Role',
    ],
    credentials: true,
    maxAge: 3600, // Cache preflight requests for 1 hour
  })

  const port = envService.get('PORT')
  const nodeEnv = envService.get('NODE_ENV')

  RequestContext.run(async () => {
    app.setGlobalPrefix('api/v1')

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        validationError: {
          target: false,
          value: false,
        },
      }),
    )

    app.useGlobalInterceptors(new RequestIdInterceptor())
    app.useGlobalFilters(
      new GlobalExceptionFilter(app.get(LOGGER_SERVICE), envService),
    )

    app.useGlobalInterceptors(new LoggingInterceptor(logger))

    if (nodeEnv === 'development') {
      const config = new DocumentBuilder()
        .setTitle('Sistema de Reserva de Equipamentos Escolares')
        .setDescription(
          'API completa para gerenciamento de reservas de equipamentos escolares. ' +
          'Permite controle de equipamentos, agendamentos e usuários com diferentes níveis de permissão ' +
          '(Professores, Secretaria e Administradores). Sistema com validação de disponibilidade, ' +
          'prevenção de conflitos e rastreamento completo de status.',
        )
        .setVersion('1.0')
        .addTag('Dashboard', '📊 Estatísticas e visão geral do sistema')
        .addTag('Usuários', '👥 Gerenciamento de usuários (professores, secretaria e administradores)')
        .addTag('Equipamentos', '💻 Gerenciamento de equipamentos (notebooks, tablets, projetores, etc)')
        .addTag('Agendamentos', '📅 Gerenciamento de reservas e agendamentos de equipamentos')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Informe o token JWT obtido no endpoint de login',
          },
          'JWT-auth',
        )
        .build()

      const documentFactory = () => SwaggerModule.createDocument(app, config)
      SwaggerModule.setup('api/docs', app, documentFactory)
    } else {
      logger.log('Swagger documentation disabled in production', 'Bootstrap')
    }

    await app.listen(port)
  })
}

bootstrap()

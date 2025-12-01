import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/controller/http.module'
import { LoggerModule } from './logger/logger.module'
import { HealthModule } from './health/health.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { EventDispatchInterceptor } from './events/event-dispatch.interceptor'

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: EventDispatchInterceptor,
    },
  ],
})
export class AppModule {}

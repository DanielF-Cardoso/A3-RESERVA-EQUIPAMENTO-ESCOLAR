import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  imports: [
    PassportModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const expiresIn = env.get('JWT_EXPIRES_IN')
        return {
          secret: env.get('JWT_SECRET'),
          signOptions: {
            expiresIn: typeof expiresIn === 'string' ? expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` : expiresIn
          },
        }
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule { }

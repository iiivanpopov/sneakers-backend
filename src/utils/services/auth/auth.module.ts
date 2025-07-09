import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from './common/strategies/jwt.strategy'
import { AuthService } from './auth.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET
      })
    })
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService]
})
export class AuthModule {}

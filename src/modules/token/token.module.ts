import { PrismaModule } from '@app/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { TokenRepository } from './infrastructure/repositories/token.repository'
import { TokenService } from './infrastructure/services/token.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		PassportModule,
		PrismaModule,
		JwtModule.register({
			secret: process.env.JWT_ACCESS_SECRET,
			signOptions: { expiresIn: '1h' }
		})
	],
	providers: [TokenService, JwtStrategy, TokenRepository],
	exports: [TokenService]
})
export class TokenModule {}

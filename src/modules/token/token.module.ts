import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { TokenRepository } from './infrastructure/repositories/token.repository'
import { UserRepository } from './infrastructure/repositories/user.repository'
import { TokenService } from './infrastructure/services/token.service'
import { JwtStrategy } from './jwt/jwt.strategy'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [
		PassportModule,
		PrismaModule,
		ConfigModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('jwt.accessSecret'),
				signOptions: {
					expiresIn: config.get<string | number>('jwt.accessTTL')
				}
			})
		})
	],
	providers: [TokenService, JwtStrategy, TokenRepository, UserRepository],
	exports: [TokenService]
})
export class TokenModule {}

import { User } from '@generated/prisma'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { TokenRepository } from '../repositories/token.repository'

import configuration from '@/shared/config'
import { Tokens } from '@/token/entities/tokens'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwt: JwtService,
		private readonly tokenRepository: TokenRepository,
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>
	) {}

	async generateTokens(payload: User) {
		const accessToken = this.jwt.sign(payload, {
			secret: this.config.jwt.jwtAccessSecret,
			expiresIn: this.config.jwt.accessTTL
		})

		const refreshToken = this.jwt.sign(payload, {
			secret: this.config.jwt.jwtRefreshSecret,
			expiresIn: this.config.jwt.refreshTTL
		})

		await this.tokenRepository.upsertToken(payload, refreshToken)

		return new Tokens(accessToken, refreshToken)
	}

	verifyRefreshToken(token: string) {
		return this.jwt.verify(token, {
			secret: this.config.jwt.jwtRefreshSecret
		})
	}

	verifyAccessToken(token: string) {
		return this.jwt.verify(token, {
			secret: this.config.jwt.jwtAccessSecret
		})
	}

	async deleteToken(refreshToken: string) {
		await this.tokenRepository.deleteToken(refreshToken)
	}
}

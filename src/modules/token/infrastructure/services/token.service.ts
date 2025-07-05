import { User } from '@generated/prisma'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import configuration from 'src/config'

import { TokenRepository } from '../repositories/token.repository'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwt: JwtService,
		private readonly tokenRepository: TokenRepository,
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>
	) {}

	async generateTokens(user: User) {
		const accessToken = this.jwt.sign(
			{ sub: user.id },
			{
				secret: this.config.jwt.jwtAccessSecret,
				expiresIn: this.config.jwt.accessTTL
			}
		)

		const refreshToken = this.jwt.sign(
			{ sub: user.id },
			{
				secret: this.config.jwt.jwtRefreshSecret,
				expiresIn: this.config.jwt.refreshTTL
			}
		)

		await this.tokenRepository.upsertToken(user, refreshToken)

		return { accessToken, refreshToken }
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

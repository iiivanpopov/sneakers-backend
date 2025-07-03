import { Tokens } from '@app/token/entities/tokens'
import { User } from '@generated/prisma'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { TokenRepository } from '../repositories/token.repository'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwt: JwtService,
		private readonly tokenRepository: TokenRepository
	) {}

	async generateTokens(payload: User) {
		const accessToken = this.jwt.sign(payload, {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: '15m'
		})

		const refreshToken = this.jwt.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: '7d'
		})

		await this.tokenRepository.upsertToken(payload, refreshToken)

		return new Tokens(accessToken, refreshToken)
	}

	verifyRefreshToken(token: string) {
		return this.jwt.verify(token, {
			secret: process.env.JWT_REFRESH_SECRET
		})
	}

	verifyAccessToken(token: string) {
		return this.jwt.verify(token, {
			secret: process.env.JWT_ACCESS_SECRET
		})
	}

	async deleteToken(refreshToken: string) {
		await this.tokenRepository.deleteToken(refreshToken)
	}
}

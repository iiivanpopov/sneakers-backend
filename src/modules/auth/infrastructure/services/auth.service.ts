import { randomInt } from 'crypto'

import { Injectable } from '@nestjs/common'

import { BadOtp } from '../../exceptions/bad-otp.exception'
import { MissingRefreshToken } from '../../exceptions/missing-refresh-token.exception'
import { MultipleUsers } from '../../exceptions/multiple-users.exception'
import { OtpNotFound } from '../../exceptions/otp-not-found.exception'
import { UserAlreadyExists } from '../../exceptions/user-exists.exception'
import { UserNotFound } from '../../exceptions/user-not-found.exception'
import { LoginDto } from '../../presentation/dto/login.dto'
import { RegisterDto } from '../../presentation/dto/register.dto'
import { OtpRepository } from '../repositories/otp.repository'
import { UserRepository } from '../repositories/user.repository'

import { TokenService } from '@/modules/token/infrastructure/services/token.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly otpRepository: OtpRepository,
		private readonly tokenService: TokenService
	) {}

	async register({ user, otp }: RegisterDto) {
		const exists = await this.userRepository.existsUnique(user)
		if (exists) throw new UserAlreadyExists()

		const confirmed = await this.otpRepository.confirm(user.email, otp)
		if (!confirmed) throw new BadOtp()

		const created = await this.userRepository.create(user)
		const tokens = await this.tokenService.generateTokens(created)

		return { user: created, tokens }
	}

	async login({ otp, identifier }: LoginDto) {
		const email = await this.resolveIdentifier(identifier)
		const confirmed = await this.otpRepository.confirm(email, otp)
		if (!confirmed) throw new BadOtp()

		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new UserNotFound()
		const tokens = await this.tokenService.generateTokens(user)

		return { user, tokens }
	}

	async getOtp(identifier: string) {
		const email = await this.resolveIdentifier(identifier)

		const existing = await this.otpRepository.get(email)
		if (existing) return existing

		const newOtp = randomInt(100000, 1000000).toString()
		return this.otpRepository.set(email, newOtp)
	}

	async logout(refreshToken: string) {
		if (!refreshToken) throw new MissingRefreshToken()

		await this.tokenService.deleteToken(refreshToken)
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) throw new MissingRefreshToken()

		const user = await this.userRepository.findByRefreshToken(refreshToken)
		if (!user) throw new UserNotFound()
		const tokens = await this.tokenService.generateTokens(user)

		return { user, tokens }
	}

	private async resolveIdentifier(identifier: string): Promise<string> {
		if (identifier.includes('@')) return identifier

		const users = await this.userRepository.findByName(identifier)
		if (!users.length) throw new UserNotFound()

		const candidates: string[] = []

		for (const user of users) {
			const hasOtp = await this.otpRepository.exists(user.email)
			if (hasOtp) candidates.push(user.email)
		}

		if (candidates.length === 1) return candidates[0]
		if (candidates.length > 1) throw new MultipleUsers()

		throw new OtpNotFound()
	}
}

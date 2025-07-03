import { randomInt } from 'crypto'

import { Injectable } from '@nestjs/common'

import { LoginDto } from '../../presentation/dto/login.dto'
import { RegisterDto } from '../../presentation/dto/register.dto'
import { User } from '../entities/User'
import { OTPRepository } from '../repositories/otp.repository'
import { UserRepository } from '../repositories/user.repository'
import { verifyPassword } from '../utils/password'

import {
	UserAlreadyExists,
	BadOTP,
	UserNotFound,
	MissingRefreshToken,
	MultipleUsers,
	OTPNotFound,
	BadPassword
} from '@/auth/exceptions'
import { TokenService } from '@/token/infrastructure/services/token.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly otpRepository: OTPRepository,
		private readonly tokenService: TokenService
	) {}

	async register({ user, otp }: RegisterDto) {
		const exists = await this.userRepository.existsUnique(user)
		if (exists) throw new UserAlreadyExists()

		const confirmedOTP = await this.otpRepository.confirm(user.email, otp)
		if (!confirmedOTP) throw new BadOTP()

		const created = await this.userRepository.create(user)
		const tokens = await this.tokenService.generateTokens(created)

		return {
			user: new User(created.email, created.name, created.phone, created.role),
			tokens
		}
	}

	async login({ otp, identifier, password }: LoginDto) {
		const email = await this.resolveIdentifier(identifier)

		const confirmedOTP = await this.otpRepository.confirm(email, otp)
		if (!confirmedOTP) throw new BadOTP()

		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new UserNotFound()

		const verifiedPassword = await verifyPassword(password, user.hashPassword)
		if (!verifiedPassword) throw new BadPassword()

		const tokens = await this.tokenService.generateTokens(user)

		return {
			user: new User(user.email, user.name, user.phone, user.role),
			tokens
		}
	}

	async getOTP(identifier: string) {
		const email = await this.resolveIdentifier(identifier)

		const existing = await this.otpRepository.get(email)
		if (existing) return existing

		const newOTP = randomInt(100000, 1000000).toString()

		return this.otpRepository.set(email, newOTP)
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

		return {
			user: new User(user.email, user.name, user.phone, user.role),
			tokens
		}
	}

	private async resolveIdentifier(identifier: string): Promise<string> {
		if (identifier.includes('@')) return identifier

		const users = await this.userRepository.findByName(identifier)
		if (!users.length) throw new UserNotFound()

		const candidates: string[] = []

		for (const user of users) {
			const hasOTP = await this.otpRepository.exists(user.email)
			if (hasOTP) candidates.push(user.email)
		}

		if (candidates.length === 1) return candidates[0]
		if (candidates.length > 1) throw new MultipleUsers()

		throw new OTPNotFound()
	}
}

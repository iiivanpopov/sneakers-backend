import { randomInt } from 'crypto'

import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { REDIS_KEYS } from '@/constants/keys'

@Injectable()
export class OTPRepository {
	constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

	async get(email: string) {
		return this.redis.get(REDIS_KEYS.OTP(email))
	}

	async requestOTP(email: string) {
		const existing = await this.get(email)
		if (existing) return existing

		const newOTP = this.generate()

		return this.set(email, newOTP)
	}

	generate() {
		return randomInt(100000, 1000000).toString()
	}

	async set(email: string, otp: string) {
		await this.redis.set(REDIS_KEYS.OTP(email), otp, 'EX', 120)
		return otp
	}

	async exists(email: string) {
		return this.redis.exists(REDIS_KEYS.OTP(email))
	}

	async confirm(email: string, otp: string) {
		const stored = await this.redis.get(REDIS_KEYS.OTP(email))
		if (stored === otp) {
			await this.redis.del(REDIS_KEYS.OTP(email))
			return true
		}
		return false
	}
}

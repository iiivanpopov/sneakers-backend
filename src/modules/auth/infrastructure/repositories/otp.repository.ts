import { randomInt } from 'crypto'

import { Injectable } from '@nestjs/common'
import { RedisService } from 'src/modules/redis/redis.service'

import { REDIS_KEYS } from '@/constants/keys'

@Injectable()
export class OTPRepository {
	constructor(private readonly redisService: RedisService) {}

	async get(email: string) {
		return this.redisService.get(REDIS_KEYS.OTP(email))
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
		await this.redisService.set(REDIS_KEYS.OTP(email), otp, 120)
		return otp
	}

	async exists(email: string) {
		return this.redisService.exists(REDIS_KEYS.OTP(email))
	}

	async confirm(email: string, otp: string) {
		const stored = await this.redisService.get(REDIS_KEYS.OTP(email))
		if (stored === otp) {
			await this.redisService.del(REDIS_KEYS.OTP(email))
			return true
		}
		return false
	}
}

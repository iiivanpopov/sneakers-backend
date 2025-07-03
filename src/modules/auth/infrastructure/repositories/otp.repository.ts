import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { REDIS_KEYS } from '../../constants/keys'

@Injectable()
export class OtpRepository {
	constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

	async get(email: string) {
		return this.redis.get(REDIS_KEYS.OTP(email))
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
		return stored === otp
	}
}

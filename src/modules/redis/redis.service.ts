import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

	async invalidateCache(entity: string, params: Record<string, any>) {
		await this.del(`${entity}:${JSON.stringify(params)}`)
	}

	async set(key: string, value: any, ttl?: number) {
		const data = typeof value === 'string' ? value : JSON.stringify(value)
		return ttl
			? this.client.set(key, data, 'EX', ttl)
			: this.client.set(key, data)
	}

	async get<T = string>(key: string): Promise<T | null> {
		const value = await this.client.get(key)

		if (value === null) return null

		try {
			return JSON.parse(value)
		} catch {
			return value as T
		}
	}

	async del(key: string) {
		return this.client.del(key)
	}

	async exists(key: string) {
		return this.client.exists(key)
	}
}

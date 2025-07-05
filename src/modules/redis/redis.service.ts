import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'

import { REDIS_KEYS } from '@/shared/constants/keys'

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

	async getPopularSneakers(limit = 10): Promise<string[]> {
		return this.client.zrevrange(REDIS_KEYS.POPULAR_MODELS, 0, limit - 1)
	}

	async incrementPopularity(slug: string): Promise<void> {
		await this.client.zincrby(REDIS_KEYS.POPULAR_MODELS, 1, slug)
	}

	async set<T = any>(key: string, value: T, ttlInSec?: number): Promise<'OK'> {
		const data = typeof value === 'string' ? value : JSON.stringify(value)
		return ttlInSec
			? this.client.set(key, data, 'EX', ttlInSec)
			: this.client.set(key, data)
	}

	async get<T = string>(key: string): Promise<T | null> {
		const value = await this.client.get(key)
		if (value === null) return null

		try {
			return JSON.parse(value) as T
		} catch {
			return value as T
		}
	}

	async mget<T = string>(keys: string[]): Promise<(T | null)[]> {
		const values = await this.client.mget(...keys)
		return values.map(val => {
			if (val === null) return null
			try {
				return JSON.parse(val) as T
			} catch {
				return val as T
			}
		})
	}

	async mset<T extends Record<string, any>>(
		entries: T,
		ttlInSec?: number
	): Promise<void> {
		const flattened = Object.entries(entries).flatMap(([k, v]) => [
			k,
			typeof v === 'string' ? v : JSON.stringify(v)
		])
		await this.client.mset(...flattened)

		if (ttlInSec) {
			await Promise.all(
				Object.keys(entries).map(key => this.client.expire(key, ttlInSec))
			)
		}
	}

	async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key)
		return result === 1
	}

	async del(keys: string | string[]): Promise<number> {
		return Array.isArray(keys)
			? this.client.del(...keys)
			: this.client.del(keys)
	}

	async keys(pattern: string): Promise<string[]> {
		return this.client.keys(pattern)
	}

	async invalidate(keys: string | string[]): Promise<void> {
		await this.del(keys)
	}
}

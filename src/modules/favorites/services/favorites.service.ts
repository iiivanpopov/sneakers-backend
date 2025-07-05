import { Injectable } from '@nestjs/common'
import { RedisService } from 'src/modules/redis/redis.service'

import { FavoritesRepository } from '../repositories/favorites.repository'

@Injectable()
export class FavoritesService {
	constructor(
		private readonly favoritesRepository: FavoritesRepository,
		private readonly redisService: RedisService
	) {}

	async get(userId: string) {
		return this.favoritesRepository.get(userId)
	}

	async add(userId: string, slug: string) {
		const exists = await this.favoritesRepository.exists(userId, slug)
		if (!exists) await this.redisService.incrementPopularity(slug)

		return this.favoritesRepository.add(userId, slug)
	}

	async delete(userId: string, slug: string) {
		return this.favoritesRepository.delete(userId, slug)
	}
}

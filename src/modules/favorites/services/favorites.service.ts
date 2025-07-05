import { Injectable } from '@nestjs/common'

import { FavoritesRepository } from '../repositories/favorites.repository'

@Injectable()
export class FavoritesService {
	constructor(private readonly favoritesRepository: FavoritesRepository) {}

	async get(userId: string) {
		return this.favoritesRepository.get(userId)
	}

	async create(userId: string, slug: string) {
		return this.favoritesRepository.create(userId, slug)
	}

	async delete(userId: string, slug: string) {
		return this.favoritesRepository.delete(userId, slug)
	}
}

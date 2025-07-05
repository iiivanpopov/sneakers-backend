import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'

import { FavoritesService } from '../services/favorites.service'

import { User } from '@/auth/domain/entities/User'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller('/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
	constructor(private readonly favoritesService: FavoritesService) {}

	@Get()
	async getFavorites(@CurrentUser() user: User) {
		const data = await this.favoritesService.get(user.id)

		return {
			favorites: data,
			message: 'Fetched favorites successfully'
		}
	}

	@Post(':slug')
	async addFavorite(@CurrentUser() user: User, @Param('slug') slug: string) {
		await this.favoritesService.add(user.id, slug)

		return {
			message: 'Added favorite successfully',
			success: true
		}
	}

	@Delete(':slug')
	async deleteFavorite(@CurrentUser() user: User, @Param('slug') slug: string) {
		await this.favoritesService.delete(user.id, slug)

		return {
			message: 'Deleted favorite successfully',
			success: true
		}
	}
}

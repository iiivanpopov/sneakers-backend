import { Module } from '@nestjs/common'

import { RedisModule } from '../redis/redis.module'

import { FavoritesController } from './controllers/favorites.controller'
import { FavoritesRepository } from './repositories/favorites.repository'
import { FavoritesService } from './services/favorites.service'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule, RedisModule],
	providers: [FavoritesService, FavoritesRepository],
	controllers: [FavoritesController]
})
export class FavoritesModule {}

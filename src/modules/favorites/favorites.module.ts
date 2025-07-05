import { Module } from '@nestjs/common'

import { FavoritesController } from './controllers/favorites.controller'
import { FavoritesRepository } from './repositories/favorites.repository'
import { FavoritesService } from './services/favorites.service'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	providers: [FavoritesService, FavoritesRepository],
	controllers: [FavoritesController]
})
export class FavoritesModule {}

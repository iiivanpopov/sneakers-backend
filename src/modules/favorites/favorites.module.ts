import { Module } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { FavoritesRepository } from './favorites.repository'
import { PrismaModule } from '@/utils/services/prisma'
import { FavoritesController } from './favorites.controller'
import { BrandsService, PopularityService, SneakersService } from '../catalog'

@Module({
  imports: [PrismaModule],
  providers: [
    FavoritesService,
    FavoritesRepository,
    SneakersService,
    PopularityService,
    BrandsService
  ],
  exports: [FavoritesService],
  controllers: [FavoritesController]
})
export class FavoritesModule {}

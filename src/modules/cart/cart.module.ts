import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { FavoritesService } from '../favorites/favorites.service'
import { FavoritesRepository } from '../favorites/favorites.repository'

@Module({
  imports: [PrismaModule],
  providers: [CartService, FavoritesService, FavoritesRepository],
  exports: [CartService],
  controllers: [CartController]
})
export class CartModule {}

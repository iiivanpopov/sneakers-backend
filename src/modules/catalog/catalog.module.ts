import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { BrandsRepository } from './repositories/brands.repository'
import { StockRepository } from './repositories/stock.repository'
import { SneakersRepository } from './repositories/sneakers.repository'
import { DiscountController } from './controllers/discount.controller'
import { DiscountRepository } from './repositories/discount.repository'
import { PopularityRepository } from './repositories/popularity.repository'
import { PopularController } from './controllers/popular.controller'
import { SneakersController } from './controllers/sneakers.controller'
import { StockController } from './controllers/stock.controller'
import { BrandsService } from './services/brands.service'
import { DiscountService } from './services/discount.service'
import { PopularityService } from './services/popularity.service'
import { SneakersService } from './services/sneakers.service'
import { StockService } from './services/stock.service'
import { FavoritesService } from '../favorites/favorites.service'

@Module({
  imports: [PrismaModule],
  providers: [
    SneakersRepository,
    BrandsRepository,
    StockRepository,
    DiscountRepository,
    PopularityRepository,
    FavoritesService,

    FavoritesService,
    SneakersService,
    BrandsService,
    StockService,
    DiscountService,
    PopularityService
  ],
  exports: [
    SneakersRepository,
    BrandsRepository,
    StockRepository,
    DiscountRepository,
    PopularityRepository
  ],
  controllers: [
    SneakersController,
    DiscountController,
    BrandsController,
    PopularController,
    StockController
  ]
})
export class CatalogModule {}

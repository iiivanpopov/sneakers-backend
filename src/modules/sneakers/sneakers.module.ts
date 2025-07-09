import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { SneakersController } from './sneakers.controller'
import { BrandsService } from './services/brands.service'
import { StockService } from './services/stock.service'
import { SneakersService } from './services/sneakers.service'

@Module({
  imports: [PrismaModule],
  providers: [SneakersService, BrandsService, StockService],
  exports: [SneakersService, BrandsService, StockService],
  controllers: [SneakersController]
})
export class SneakersModule {}

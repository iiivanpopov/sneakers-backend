import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'

@Module({
  imports: [PrismaModule],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController]
})
export class CartModule {}

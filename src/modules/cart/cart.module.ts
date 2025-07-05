import { Module } from '@nestjs/common'

import { RedisModule } from '../redis/redis.module'

import { CartController } from './controllers/cart.controller'
import { CartRepository } from './repositories/cart.repository'
import { CartService } from './services/cart.service'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	controllers: [CartController],
	providers: [CartService, CartRepository],
	imports: [PrismaModule, RedisModule],
	exports: [CartRepository]
})
export class CartModule {}

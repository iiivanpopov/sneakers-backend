import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { RedisModule } from '../redis/redis.module'

import {
	CreateSneakerModelHandler,
	DeleteSneakerModelHandler,
	UpdateSneakerModelHandler
} from './infrastructure/commands'
import {
	GetSneakerModelHandler,
	GetSneakerModelsHandler,
	SearchSneakerModelsHandler
} from './infrastructure/queries'
import { SneakersRepository } from './infrastructure/repositories/sneaker.repository'
import { SneakersService } from './infrastructure/services/sneakers.service'
import { SneakersController } from './presentation/controllers/sneakers.controller'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [CqrsModule, PrismaModule, RedisModule],
	providers: [
		SneakersRepository,
		CreateSneakerModelHandler,
		SearchSneakerModelsHandler,
		GetSneakerModelsHandler,
		GetSneakerModelHandler,
		UpdateSneakerModelHandler,
		DeleteSneakerModelHandler,
		SneakersService
	],
	controllers: [SneakersController]
})
export class SneakersModule {}

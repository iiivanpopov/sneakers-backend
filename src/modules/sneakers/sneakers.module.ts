import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { RedisModule } from '../redis/redis.module'

import {
	CreateSneakerModelHandler,
	DeleteSneakerModelHandler,
	UpdateSneakerModelHandler
} from './infrastructure/commands'
import { CreateSneakerHandler } from './infrastructure/commands/handlers/create-sneaker.handler'
import { UpdateSneakersHandler } from './infrastructure/commands/handlers/update-sneakers.handler'
import {
	GetSneakerModelHandler,
	GetSneakerModelsHandler,
	SearchSneakerModelsHandler
} from './infrastructure/queries'
import { GetPopularModelsHandler } from './infrastructure/queries/handlers/get-popular-models.handler'
import { GetSneakerBrandsHandler } from './infrastructure/queries/handlers/get-sneaker-brands.handler'
import { GetSneakersHandler } from './infrastructure/queries/handlers/get-sneakers.handler'
import { SneakerModelsRepository } from './infrastructure/repositories/sneaker-models.repository'
import { SneakersRepository } from './infrastructure/repositories/sneakers.repository'
import { SneakersModelService } from './infrastructure/services/sneaker-models.service'
import { SneakersService } from './infrastructure/services/sneakers.service'
import { SneakerModelsController } from './presentation/controllers/sneaker-models.controller'
import { SneakersController } from './presentation/controllers/sneakers.controller'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [CqrsModule, PrismaModule, RedisModule],
	providers: [
		SneakersService,
		SneakersModelService,

		SneakersRepository,
		SneakerModelsRepository,

		SearchSneakerModelsHandler,
		GetSneakerModelsHandler,
		GetSneakersHandler,
		GetSneakerModelHandler,
		GetPopularModelsHandler,
		GetSneakerBrandsHandler,

		UpdateSneakerModelHandler,
		DeleteSneakerModelHandler,
		CreateSneakerHandler,
		CreateSneakerModelHandler,
		UpdateSneakersHandler
	],
	controllers: [SneakerModelsController, SneakersController]
})
export class SneakersModule {}

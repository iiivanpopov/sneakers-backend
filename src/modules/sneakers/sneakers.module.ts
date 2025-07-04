import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CreateSneakerModelHandler } from './infrastructure/commands/handlers/create-sneaker-model.handler'
import { GetSneakersHandler } from './infrastructure/queries/handlers/get-sneakers.handler'
import { SearchSneakersHandler } from './infrastructure/queries/handlers/search-sneakers.handler'
import { SneakersRepository } from './infrastructure/repositories/sneaker.repository'
import { SneakersService } from './infrastructure/services/sneakers.service'
import { SneakersController } from './presentation/controllers/sneakers.controller'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [CqrsModule, PrismaModule],
	providers: [
		SneakersRepository,
		GetSneakersHandler,
		CreateSneakerModelHandler,
		SearchSneakersHandler,
		SneakersService
	],
	controllers: [SneakersController]
})
export class SneakersModule {}

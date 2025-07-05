import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import {
	CreateSneakerModelCommand,
	DeleteSneakerModelCommand,
	UpdateSneakerModelCommand
} from '../commands'
import {
	GetSneakerModelsQuery,
	GetSneakerModelQuery,
	SearchSneakerModelsQuery
} from '../queries'
import { GetPopularModelsQuery } from '../queries/get-popular-models.query'
import { GetSneakerBrandsQuery } from '../queries/get-sneaker-brands.query'

@Injectable()
export class SneakersModelService {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	async getSneakerModels(offset: number, limit: number) {
		return this.queryBus.execute(new GetSneakerModelsQuery(offset, limit))
	}

	async getSneakerBrands() {
		return this.queryBus.execute(new GetSneakerBrandsQuery())
	}

	async getPopularModels() {
		return this.queryBus.execute(new GetPopularModelsQuery())
	}

	async getSneakerModel(slug: string) {
		return this.queryBus.execute(new GetSneakerModelQuery(slug))
	}

	async searchSneakers(offset: number, limit: number, search: string) {
		return this.queryBus.execute(
			new SearchSneakerModelsQuery(offset, limit, search)
		)
	}

	async createSneakerModel(sneakerModel: CreateSneakerModelPayload) {
		return this.commandBus.execute(new CreateSneakerModelCommand(sneakerModel))
	}

	async deleteSneakerModel(slug: string) {
		return this.commandBus.execute(new DeleteSneakerModelCommand(slug))
	}

	async updateSneakerModel(
		slug: string,
		sneakerModel: Partial<CreateSneakerModelPayload>
	) {
		return this.commandBus.execute(
			new UpdateSneakerModelCommand(slug, sneakerModel)
		)
	}
}

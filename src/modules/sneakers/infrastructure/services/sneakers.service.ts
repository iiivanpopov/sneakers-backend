import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import {
	DeleteSneakerModelCommand,
	UpdateSneakerModelCommand
} from '../commands'
import { CreateSneakerCommand } from '../commands/create-sneaker-model.command'
import { GetSneakerModelQuery } from '../queries/get-sneaker-model.query'
import { GetSneakerModelsQuery } from '../queries/get-sneaker-models.query'
import { SearchSneakersQuery } from '../queries/search-sneakers.query'

@Injectable()
export class SneakersService {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	async getSneakers(offset: number, limit: number) {
		return this.queryBus.execute(new GetSneakerModelsQuery(offset, limit))
	}

	async getSneakerBySlug(slug: string) {
		return this.queryBus.execute(new GetSneakerModelQuery(slug))
	}

	async searchSneakers(offset: number, limit: number, search: string) {
		return this.queryBus.execute(new SearchSneakersQuery(offset, limit, search))
	}

	async createSneakerModel(sneakerModel: CreateSneakerModelPayload) {
		return this.commandBus.execute(new CreateSneakerCommand(sneakerModel))
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

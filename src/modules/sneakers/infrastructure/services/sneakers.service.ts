import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import { CreateSneakerCommand } from '../commands/create-sneaker-model.command'
import { GetSneakersQuery } from '../queries/get-sneakers.query'
import { SearchSneakersQuery } from '../queries/search-sneakers.query'

@Injectable()
export class SneakersService {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	async getSneakers(offset: number, limit: number) {
		return this.queryBus.execute(new GetSneakersQuery(offset, limit))
	}

	async searchSneakers(offset: number, limit: number, search: string) {
		return this.queryBus.execute(new SearchSneakersQuery(offset, limit, search))
	}

	async createSneakerModel(sneakerModel: CreateSneakerModelPayload) {
		return this.commandBus.execute(new CreateSneakerCommand(sneakerModel))
	}
}

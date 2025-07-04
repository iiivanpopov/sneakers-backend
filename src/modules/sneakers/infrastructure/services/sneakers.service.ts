import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { CreateSneakerPayload } from '../../domain/interfaces/create-sneaker-payload'
import { CreateSneakerCommand } from '../commands/create-sneaker.command'
import { GetSneakersQuery } from '../queries/get-sneakers.query'

@Injectable()
export class SneakersService {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	async createSneaker(slug: string, sneaker: CreateSneakerPayload) {
		return this.commandBus.execute(new CreateSneakerCommand(slug, sneaker))
	}

	async getSneakers(slug: string) {
		return this.queryBus.execute(new GetSneakersQuery(slug))
	}
}

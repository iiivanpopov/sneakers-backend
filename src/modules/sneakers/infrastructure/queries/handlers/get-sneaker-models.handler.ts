import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { GetSneakerModelsQuery } from '../get-sneaker-models.query'

@QueryHandler(GetSneakerModelsQuery)
export class GetSneakerModelsHandler
	implements IQueryHandler<GetSneakerModelsQuery>
{
	constructor(private readonly sneakersRepository: SneakerModelsRepository) {}

	async execute(query: GetSneakerModelsQuery) {
		const { offset, limit, userId } = query
		return this.sneakersRepository.findMany(
			{ skip: offset, take: limit },
			userId
		)
	}
}

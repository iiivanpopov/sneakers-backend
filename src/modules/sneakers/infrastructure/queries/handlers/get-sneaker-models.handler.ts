import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakersRepository } from '../../repositories/sneaker.repository'
import { GetSneakerModelsQuery } from '../get-sneaker-models.query'

@QueryHandler(GetSneakerModelsQuery)
export class GetSneakerModelsHandler
	implements IQueryHandler<GetSneakerModelsQuery>
{
	constructor(private readonly sneakersRepository: SneakersRepository) {}

	async execute(query: GetSneakerModelsQuery) {
		const { offset, limit } = query
		return this.sneakersRepository.findMany({ skip: offset, take: limit })
	}
}

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakersRepository } from '../../repositories/sneaker.repository'
import { GetSneakersQuery } from '../get-sneakers.query'

@QueryHandler(GetSneakersQuery)
export class GetSneakersHandler implements IQueryHandler<GetSneakersQuery> {
	constructor(private readonly sneakersRepository: SneakersRepository) {}

	async execute(query: GetSneakersQuery) {
		const { offset, limit } = query
		return this.sneakersRepository.findMany({ skip: offset, take: limit })
	}
}

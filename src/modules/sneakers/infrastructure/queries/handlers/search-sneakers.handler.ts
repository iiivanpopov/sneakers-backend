import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakersRepository } from '../../repositories/sneaker.repository'
import { SearchSneakersQuery } from '../search-sneakers.query'

@QueryHandler(SearchSneakersQuery)
export class SearchSneakersHandler
	implements IQueryHandler<SearchSneakersQuery>
{
	constructor(private readonly sneakersRepository: SneakersRepository) {}

	async execute(query: SearchSneakersQuery) {
		const { offset, limit, search } = query
		return this.sneakersRepository.findMany({
			skip: offset,
			take: limit,
			where: {
				OR: [
					{ name: { contains: search, mode: 'insensitive' } },
					{ brand: { contains: search, mode: 'insensitive' } },
					{ colorway: { contains: search, mode: 'insensitive' } }
				]
			}
		})
	}
}

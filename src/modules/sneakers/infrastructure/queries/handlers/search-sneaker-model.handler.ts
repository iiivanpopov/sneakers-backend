import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { RedisService } from 'src/modules/redis/redis.service'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { SearchSneakerModelsQuery } from '../search-sneaker-models.query'

@QueryHandler(SearchSneakerModelsQuery)
export class SearchSneakerModelsHandler
	implements IQueryHandler<SearchSneakerModelsQuery>
{
	constructor(
		private readonly sneakersRepository: SneakerModelsRepository,
		private readonly redisService: RedisService
	) {}

	async execute(query: SearchSneakerModelsQuery) {
		const { offset, limit, search } = query

		const direct = await this.sneakersRepository.findOne({
			where: {
				OR: [{ slug: search }, { name: search }]
			}
		})

		if (direct) {
			await this.redisService.incrementPopularity(direct.slug)
			return [direct]
		}

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

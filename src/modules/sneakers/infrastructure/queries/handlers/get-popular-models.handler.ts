import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { RedisService } from 'src/modules/redis/redis.service'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { GetPopularModelsQuery } from '../get-popular-models.query'

@QueryHandler(GetPopularModelsQuery)
export class GetPopularModelsHandler
	implements IQueryHandler<GetPopularModelsQuery>
{
	constructor(
		private readonly sneakersRepository: SneakerModelsRepository,
		private readonly redisService: RedisService
	) {}

	async execute(_query: GetPopularModelsQuery) {
		const slugs = await this.redisService.getPopularSneakers()
		if (!slugs.length) return []

		return this.sneakersRepository.findManyBySlugs(slugs)
	}
}

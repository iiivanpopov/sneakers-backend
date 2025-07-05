import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { RedisService } from 'src/modules/redis/redis.service'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { GetSneakerModelQuery } from '../get-sneaker-model.query'

import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@QueryHandler(GetSneakerModelQuery)
export class GetSneakerModelHandler
	implements IQueryHandler<GetSneakerModelQuery>
{
	constructor(
		private readonly sneakersRepository: SneakerModelsRepository,
		private readonly redisService: RedisService
	) {}

	async execute(query: GetSneakerModelQuery) {
		const exists = await this.sneakersRepository.existsBySlug(query.slug)
		if (!exists) throw new SneakerModelNotFound()

		await this.redisService.incrementPopularity(query.slug)

		return this.sneakersRepository.findBySlug(query.slug, query.userId)
	}
}

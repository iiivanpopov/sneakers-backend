import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { SneakersRepository } from '../../repositories/sneakers.repository'
import { GetSneakersQuery } from '../get-sneakers.query'

import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@QueryHandler(GetSneakersQuery)
export class GetSneakersHandler implements IQueryHandler<GetSneakersQuery> {
	constructor(
		private readonly sneakersModelRepository: SneakerModelsRepository,
		private readonly sneakersRepository: SneakersRepository
	) {}

	async execute(query: GetSneakersQuery) {
		const model = await this.sneakersModelRepository.existsBySlug(query.slug)
		if (!model) throw new SneakerModelNotFound()

		return this.sneakersRepository.findBySlug(query.slug)
	}
}

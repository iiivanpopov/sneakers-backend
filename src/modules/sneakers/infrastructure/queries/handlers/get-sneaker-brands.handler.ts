import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { GetSneakerBrandsQuery } from '../get-sneaker-brands.query'

@QueryHandler(GetSneakerBrandsQuery)
export class GetSneakerBrandsHandler
	implements IQueryHandler<GetSneakerBrandsQuery>
{
	constructor(private readonly sneakersRepository: SneakerModelsRepository) {}

	async execute(_query: GetSneakerBrandsQuery) {
		const brands = await this.sneakersRepository.getBrands()
		return brands.map(b => b.brand)
	}
}

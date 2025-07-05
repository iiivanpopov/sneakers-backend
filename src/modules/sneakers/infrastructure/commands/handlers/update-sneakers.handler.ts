import { Sneaker } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { SneakersRepository } from '../../repositories/sneakers.repository'
import { UpdateSneakersCommand } from '../update-sneakers.command'

import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@CommandHandler(UpdateSneakersCommand)
export class UpdateSneakersHandler
	implements ICommandHandler<UpdateSneakersCommand>
{
	constructor(
		private readonly sneakerModelsRepository: SneakerModelsRepository,
		private readonly sneakersRepository: SneakersRepository
	) {}
	async execute(command: UpdateSneakersCommand): Promise<Sneaker[]> {
		const exists = await this.sneakerModelsRepository.existsBySlug(command.slug)
		if (!exists) throw new SneakerModelNotFound()

		const model = await this.sneakerModelsRepository.findBySlug(command.slug)

		return this.sneakersRepository.updateMany(model.id, command.dto)
	}
}

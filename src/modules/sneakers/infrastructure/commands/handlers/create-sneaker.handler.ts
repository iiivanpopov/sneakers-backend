import { Sneaker } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { SneakersRepository } from '../../repositories/sneakers.repository'
import { CreateSneakerCommand } from '../create-sneaker.command'

import { SneakerAlreadyExists } from '@/exceptions/sneakers/sneaker-already-exists.exception'
import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@CommandHandler(CreateSneakerCommand)
export class CreateSneakerHandler
	implements ICommandHandler<CreateSneakerCommand>
{
	constructor(
		private readonly sneakerModelsRepository: SneakerModelsRepository,
		private readonly sneakersRepository: SneakersRepository
	) {}
	async execute(command: CreateSneakerCommand): Promise<Sneaker> {
		const exists = await this.sneakerModelsRepository.sneakerModelExistsBySlug(
			command.slug
		)
		if (!exists) throw new SneakerModelNotFound()

		const sneaker = await this.sneakersRepository.sneakerExists(
			command.slug,
			command.sneaker.size
		)
		if (sneaker) throw new SneakerAlreadyExists()

		return this.sneakersRepository.createSneaker(command.slug, command.sneaker)
	}
}

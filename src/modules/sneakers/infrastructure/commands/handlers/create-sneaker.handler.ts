import { Sneaker } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { SneakersRepository } from '../../repositories/sneakers.repository'
import { CreateSneakerCommand } from '../create-sneaker.command'

import { SneakerAlreadyExists, SneakerModelNotFound } from '@/exceptions/index'

@CommandHandler(CreateSneakerCommand)
export class CreateSneakerHandler
	implements ICommandHandler<CreateSneakerCommand>
{
	constructor(
		private readonly sneakerModelsRepository: SneakerModelsRepository,
		private readonly sneakersRepository: SneakersRepository
	) {}
	async execute(command: CreateSneakerCommand): Promise<Sneaker> {
		const exists = await this.sneakerModelsRepository.existsBySlug(command.slug)
		if (!exists) throw new SneakerModelNotFound()

		const sneaker = await this.sneakersRepository.exists(
			command.slug,
			command.sneaker.size
		)
		if (sneaker) throw new SneakerAlreadyExists()

		return this.sneakersRepository.create(command.slug, command.sneaker)
	}
}
